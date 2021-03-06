using Microsoft.EntityFrameworkCore;

namespace Snippet.Entity
{
    [Comment("空间成员关联")]
    public class SpaceMember
    {
        public int Id { get; set; }

        [Comment("空间Id")]
        public int SpaceId { get; set; }

        [Comment("成员Id")]
        public string MemberName { get; set; }

        // 0是指个人空间
        [Comment("成员角色：0：拥有者，1：管理员，2：编辑者，3：观察者")]
        public int MemberRole { get; set; }
    }
}