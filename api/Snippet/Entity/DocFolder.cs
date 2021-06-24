using Microsoft.EntityFrameworkCore;

namespace Snippet.Entity
{
    public class DocFolder
    {
        public int Id { get; set; }

        [Comment("空间Id")]
        public int SpaceId { get; set; }

        [Comment("文件夹名")]
        public string Name { get; set; }
    }
}