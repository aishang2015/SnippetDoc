using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using Serilog.Filters;
using Snippet.Business.Services;
using Snippet.Core.Data;
using System;
using System.IO;

namespace Snippet
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration().CreateBootstrapLogger();

            try
            {
                Log.Information("Server start Runing!");
                var builder = CreateHostBuilder(args).Build();
                builder.InitialDatabase();
                InitUserCache(builder);
                builder.Run();
            }
            catch (Exception e)
            {
                Log.Error(e, "Exception happened!");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                }).UseSerilog((context, services, configuration) =>
                {
                    // ��ȡappsetting�ڵ���־����
                    string logPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "logs", "log-all-.txt");
                    string errorLogPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "logs", "log-error-.txt");
                    string serilogPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "logs", "log-serilog-.txt");
                    string logFormat = @"{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3} {SourceContext:l}] {Message:lj}{NewLine}{Exception}";
                    configuration.ReadFrom.Configuration(context.Configuration)
                            .ReadFrom.Services(services)
                           //.MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                           //.MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
                           //.MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
                           //.MinimumLevel.Override("System", LogEventLevel.Warning)
                           //.MinimumLevel.Override("Microsoft.AspNetCore.Authentication", LogEventLevel.Warning)
                           //.MinimumLevel.Override("Microsoft.EntityFrameworkCore.Infrastructure", LogEventLevel.Warning)
                           //.MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database", LogEventLevel.Information)
                           .Enrich.FromLogContext()

                           .WriteTo.Logger(config =>
                           {
                               config.WriteTo.File(logPath,
                                   restrictedToMinimumLevel: LogEventLevel.Debug,
                                   outputTemplate: logFormat,
                                   rollingInterval: RollingInterval.Day,
                                   rollOnFileSizeLimit: true,
                                   shared: true,
                                   fileSizeLimitBytes: 10_000_000);
                           })
                           .WriteTo.Logger(config =>
                           {
                               config.WriteTo.File(errorLogPath,
                                   outputTemplate: logFormat,
                                   restrictedToMinimumLevel: LogEventLevel.Error,
                                   rollingInterval: RollingInterval.Day,
                                   rollOnFileSizeLimit: true,
                                   shared: true,
                                   fileSizeLimitBytes: 10_000_000);
                           })
                           .WriteTo.Logger(config =>
                           {
                               config.WriteTo.File(serilogPath,
                                   outputTemplate: logFormat,
                                   restrictedToMinimumLevel: LogEventLevel.Warning,
                                   rollingInterval: RollingInterval.Day,
                                   rollOnFileSizeLimit: true,
                                   shared: true,
                                   fileSizeLimitBytes: 10_000_000);
                               config.Filter.ByIncludingOnly(Matching.FromSource("Serilog.AspNetCore"));
                           });
                });

        private static void InitUserCache(IHost host)
        {
            using (var serviceScope = host.Services.CreateScope())
            {
                var services = serviceScope.ServiceProvider;

                var userService = services.GetRequiredService<IUserService>();

                userService.LoadUserCache();
            }
        }
    }
}