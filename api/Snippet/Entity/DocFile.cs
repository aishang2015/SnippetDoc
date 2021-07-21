using Microsoft.EntityFrameworkCore;

namespace Snippet.Entity
{
    public class DocFile
    {
        public int Id { get; set; }

        [Comment("文档信息Id")]
        public int DocInfoId { get; set; }

        [Comment("文件名")]
        public string FileName { get; set; }
    }
}