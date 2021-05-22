using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Snippet.Entity;

namespace Snippet.Core.Data
{
    public class SnippetDbContext : IdentityDbContext<SnippetUser, SnippetRole, int>
    {
        public SnippetDbContext(DbContextOptions<SnippetDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            // 打印sql参数
            optionsBuilder.EnableSensitiveDataLogging();
        }
    }
}
