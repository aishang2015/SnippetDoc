using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Snippet.Entity;

namespace Snippet.Core.Data
{
    public class SnippetDbContext : IdentityDbContext<SnippetUser, SnippetRole, int>
    {
        public SnippetDbContext(DbContextOptions<SnippetDbContext> options) : base(options)
        {
        }

        public DbSet<Space> Spaces { get; set; }

        public DbSet<SpaceMember> SpaceMembers { get; set; }

        public DbSet<DocInfo> DocInfos { get; set; }

        public DbSet<DocHistory> DocHistories { get; set; }

        public DbSet<DocFolder> DocFolders { get; set; }

        public DbSet<DocFolderTree> DocFolderTrees { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            // 打印sql参数
            optionsBuilder.EnableSensitiveDataLogging();
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<SnippetUser>().HasQueryFilter(a => !a.IsDeleted);
        }
    }
}