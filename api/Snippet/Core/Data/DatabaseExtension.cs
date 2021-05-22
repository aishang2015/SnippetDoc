using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Snippet.Entity;
using System;

namespace Snippet.Core.Data
{
    public static class DatabaseExtension
    {
        public static IServiceCollection AddDatabase(this IServiceCollection services,
            IConfiguration configuration, string optionKey = "DatabaseOption")
        {
            var databaseOption = configuration.GetSection(optionKey).Get<DatabaseOption>();
            if (databaseOption != null)
            {
                services.AddDbContext<SnippetDbContext>(option =>
                {
                    option = databaseOption.Type switch
                    {
                        "SQLite" => option.UseSqlite(databaseOption.Connection),
                        "SQLServer" => option.UseSqlServer(databaseOption.Connection),

                        // mysql版本填写具体版本例如8.0.21
                        "MySQL" => option.UseMySql(databaseOption.Connection, new MySqlServerVersion(new Version(databaseOption.Version))),
                        "PostgreSQL" => option.UseNpgsql(databaseOption.Connection),

                        // oracle版本11或12
                        "Oracle" => option.UseOracle(databaseOption.Connection, b => b.UseOracleSQLCompatibility(databaseOption.Version)),
                        _ => option
                    };

                }).AddIdentity<SnippetUser, SnippetRole>(option =>
                {
                    // 密码强度设置
                    option.Password.RequireDigit = false;
                    option.Password.RequireLowercase = false;
                    option.Password.RequireUppercase = false;
                    option.Password.RequireNonAlphanumeric = false;
                    option.Password.RequiredLength = 4;
                })
                .AddEntityFrameworkStores<SnippetDbContext>()
                .AddDefaultTokenProviders();

                return services;
            }
            throw new Exception("没有配置数据库，无法找到数据库配置片段！");
        }


        public static IServiceCollection AddDatabase<TDbContext>(this IServiceCollection services,
            IConfiguration configuration, string optionKey = "DatabaseOption") where TDbContext : DbContext
        {
            var databaseOption = configuration.GetSection(optionKey).Get<DatabaseOption>();
            if (databaseOption != null)
            {
                services.AddDbContext<TDbContext>(option =>
                {
                    option = databaseOption.Type switch
                    {
                        "SQLite" => option.UseSqlite(databaseOption.Connection),
                        "SQLServer" => option.UseSqlServer(databaseOption.Connection),

                        // mysql版本填写具体版本例如8.0.21
                        "MySQL" => option.UseMySql(databaseOption.Connection, new MySqlServerVersion(new Version(databaseOption.Version))),
                        "PostgreSQL" => option.UseNpgsql(databaseOption.Connection),

                        // oracle版本11或12
                        "Oracle" => option.UseOracle(databaseOption.Connection, b => b.UseOracleSQLCompatibility(databaseOption.Version)),
                        _ => option
                    };

                });

                return services;
            }
            throw new Exception("没有配置数据库，无法找到数据库配置片段！");
        }
    }
}
