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
            // �ֱ������ݿ� ���� jwt automapper
            services.AddDatabase(Configuration);
            services.AddDistributeCache(Configuration);
            services.AddMemoryCacheHelper();
            services.AddCustomAuthentication(Configuration);
            services.AddAutoMapper(typeof(AutoMapperProfile));
            services.AddOauth(Configuration);

            // ����FluentValidation���ı�Ĭ��modelstate�ķ�����ʽ
            services.AddControllers().AddFluentValidation();
            services.ConfigureApiBehavior();

            // ���signalr
            services.AddSignalR();

            // ��Ӻ�̨����
            services.AddWorks();

            // ����swaggerȨ�޷���
            services.AddCustomSwaggerGen();

            // �������ã�����������վ����
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder
                    .SetIsOriginAllowed(o => true)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            // httpcontext����
            services.AddHttpContextAccessor();

            // ���miniprofiler
            services.AddMiniProfiler(options =>
            {
                // ���ʵ�ַ http://localhost:29680/profiler/results-index
                // ��ʷ��Ĭ�ϱ���30����
                options.RouteBasePath = "/profiler";
            }).AddEntityFramework();

            // ��ӷ���
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

            // serilog�ṩ��һ��������¼������Ϣ����־�м������������Ļ�����Ϣ�ᱻ�������־��
            app.UseCustomSerilogRequestLogging(500, "/broadcast");

            // �����쳣
            app.UseCustomExceptionHandler();

            // ʹ�ÿ�������
            app.UseCors("CorsPolicy");

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            // ���ʾ�̬�ļ�
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, "FileStore")),
                RequestPath = new PathString("/file")
            });

            // ����signalr·��
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHubs();
                endpoints.MapControllers();
            });
        }
    }
}