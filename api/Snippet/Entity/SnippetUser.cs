using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Snippet.Entity
{
    public class SnippetUser : IdentityUser<int>
    {
        [Comment("Github用户标识")]
        public int? GithubId { get; set; }

        [Comment("Baidu用户标识")]
        public string BaiduId { get; set; }
    }
}
