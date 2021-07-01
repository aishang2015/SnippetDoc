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

        [Comment("是否使用")]
        public bool IsActive { get; set; }

        [Comment("头像背景色")]
        public string AvatarColor { get; set; }

        [Comment("头像文字")]
        public string AvatarText { get; set; }

        [Comment("是否删除")]
        public bool IsDeleted { get; set; }
    }
}