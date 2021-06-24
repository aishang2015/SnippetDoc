using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Snippet.Business;
using Snippet.Core;
using Snippet.Core.Authentication;
using Snippet.Core.Cache;
using Snippet.Core.Data;
using Snippet.Core.Middleware;
using Snippet.Core.Oauth;
using Snippet.Models;
using System.IO;
using System.Reflection;

namespace Snippet
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // 分别是数据库 缓存 jwt automapper
            services.AddDatabase(Configuration);
            services.AddDistributeCache(Configuration);
            services.AddMemoryCacheHelper();
            services.AddCustomAuthentication(Configuration);
            services.AddAutoMapper(typeof(AutoMapperProfile));
            services.AddOauth(Configuration);

            // 配置FluentValidation并改变默认modelstate的返回形式
            services.AddControllers().AddFluentValidation();
            services.ConfigureApiBehavior();

            // 添加signalr
            services.AddSignalR();

            // 添加后台服务
            services.AddWorks();

            // 配置swagger权限访问
            services.AddCustomSwaggerGen();

            // 跨域配置，允许所有网站访问
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder
                    .SetIsOriginAllowed(o => true)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            // httpcontext服务
            services.AddHttpContextAccessor();

            // 添加miniprofiler
            services.AddMiniProfiler(options =>
            {
                // 访问地址 http://localhost:29680/profiler/results-index
                // 历史会默认保存30分钟
                options.RouteBasePath = "/profiler";
            }).AddEntityFramework();

            // 添加服务
            services.AddServices();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.IndexStream = () => GetType().GetTypeInfo().Assembly.GetManifestResourceStream("Snippet.Swagger.index.html");
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Snippet v1");
                });

                app.UseMiniProfiler();
            }

            // serilog提供的一个用来记录请求信息的日志中间件，所有请求的基本信息会被输出到日志中
            app.UseCustomSerilogRequestLogging(500, "/broadcast");

            // 处理异常
            app.UseCustomExceptionHandler();

            // 使用跨域配置
            app.UseCors("CorsPolicy");

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            // 访问静态文件
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, "FileStore")),
                RequestPath = new PathString("/file")
            });

            // 配置signalr路径
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHubs();
                endpoints.MapControllers();
            });
        }
    }
}