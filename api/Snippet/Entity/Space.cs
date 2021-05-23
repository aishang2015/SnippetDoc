using Microsoft.EntityFrameworkCore;

namespace Snippet.Entity
{
    public class Space
    {
        public int Id { get; set; }

        [Comment("空间名称")]
        public string Name { get; set; }
    }
}
