using Microsoft.EntityFrameworkCore;

namespace Snippet.Entity
{
    public class DocFolderTree
    {
        public int Id { get; set; }

        [Comment("祖先节点Id")]
        public int Ancestor { get; set; }

        [Comment("后代节点Id")]
        public int Descendant { get; set; }

        [Comment("祖先节点和后代节点的距离")]
        public int Length { get; set; }
    }
}
