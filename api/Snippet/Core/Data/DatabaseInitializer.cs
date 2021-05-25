using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Snippet.Constants;
using Snippet.Entity;

namespace Snippet.Core.Data
{
    public static class DatabaseInitializer
    {
        public static void InitialDatabase(this IHost host)
        {
            using (var serviceScope = host.Services.CreateScope())
            {
                var services = serviceScope.ServiceProvider;

                var dbContext = services.GetRequiredService<SnippetDbContext>();

                var logger = services.GetRequiredService<ILogger<SnippetDbContext>>();

                logger.LogInformation("开始执行初始化数据操作。");
                if (dbContext.Database.EnsureCreated())
                {
                    logger.LogInformation("数据库初始化完毕，开始创建数据。");
                    var userManager = services.GetRequiredService<UserManager<SnippetUser>>();
                    var user = new SnippetUser
                    {
                        UserName = "admin",
                        Email = "admin@tttttttttt.com.cn",
                        PhoneNumber = "16655558888",
                    };
                    userManager.CreateAsync(user, "admin").Wait();

                    var roleManager = services.GetRequiredService<RoleManager<SnippetRole>>();
                    roleManager.CreateAsync(new SnippetRole
                    {
                        Name = "系统管理员"
                    }).Wait();

                    userManager.AddToRoleAsync(user, CommonConstant.SystemManagerRole).Wait();

                    logger.LogInformation("数据创建完毕。");
                }
                logger.LogInformation("初始化数据操作执行完毕。");
            }
        }

        public static void InitialDatabase<TDbContext>(this IHost host) where TDbContext : DbContext
        {
            using (var serviceScope = host.Services.CreateScope())
            {
                var services = serviceScope.ServiceProvider;

                var dbContext = services.GetRequiredService<TDbContext>();

                var logger = services.GetRequiredService<ILogger<TDbContext>>();

                logger.LogInformation("开始执行初始化数据操作。");
                dbContext.Database.EnsureCreated();
                logger.LogInformation("初始化数据操作执行完毕。");
            }
        }
    }
}
