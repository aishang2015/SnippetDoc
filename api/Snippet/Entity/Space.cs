using Microsoft.EntityFrameworkCore;

namespace Snippet.Entity
{
    public class Space
    {
        public int Id { get; set; }

        [Comment("空间名称")]
        public string Name { get; set; }

        [Comment("空间类型 0：私有空间 1：公用空间")]
        public int Type { get; set; }

        [Comment("私有空间拥有者，公用空间此字段为空")]
        public string Owner { get; set; }
    }
}