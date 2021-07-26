using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Snippet.Constants;
using Snippet.Core.Data;
using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace Snippet.Business.Workers
{
    public class CleanFileWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        private readonly IWebHostEnvironment _webHostEnvironment;

        private readonly ILogger _logger;

        public CleanFileWorker(IServiceProvider serviceProvider,
            IWebHostEnvironment webHostEnvironment,
            ILogger<CleanFileWorker> logger)
        {
            _serviceProvider = serviceProvider;
            _webHostEnvironment = webHostEnvironment;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var isTodayRun = false;
                    while (!stoppingToken.IsCancellationRequested)
                    {
                        await Task.Delay(10000);

                        // 3点执行
                        var now = DateTime.Now;
                        if (!isTodayRun && now.Hour == 3 && now.Minute == 0)
                        {
                            using (var scope = _serviceProvider.CreateScope())
                            {
                                // 数据库中的
                                using var db = scope.ServiceProvider.GetService<SnippetDbContext>();
                                var fileNames = db.DocFiles.Select(df => df.FileName).ToList();

                                // 本地的
                                var distFolder = Path.Combine(_webHostEnvironment.ContentRootPath, CommonConstant.LocalFileStoreFolder);
                                var uselessFiles = Directory.GetFiles(distFolder)
                                    .Where(f => !fileNames.Contains(Regex.Match(f, RegexConstant.GuidPattern).Value)).ToList();

                                // 删除没有引用的文件
                                uselessFiles.ForEach(f =>
                                {
                                    File.Delete(f);
                                });
                            }

                            // 一天运行一次
                            isTodayRun = true;
                        }

                        // 重置标志位
                        if (isTodayRun && now.Hour == 3 && now.Minute > 0)
                        {
                            isTodayRun = false;
                        }
                    }
                }
                catch (Exception e)
                {
                    _logger.LogError(e, "定时清理无用文件时发生错误！");
                }
            }
        }
    }
}