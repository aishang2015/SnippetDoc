using Microsoft.EntityFrameworkCore;
using System;

namespace Snippet.Entity
{
    public class DocHistory
    {
        public int Id { get; set; }

        [Comment("文档信息Id")]
        public int DocInfoId { get; set; }

        [Comment("名称")]
        public string Name { get; set; }

        [Comment("内容")]
        public string Content { get; set; }

        [Comment("记录时间")]
        public DateTime RecordAt { get; set; }
    }
}
