using Microsoft.EntityFrameworkCore;
using System;

namespace Snippet.Entity
{
    public class DocHistory
    {
        public int Id { get; set; }

        [Comment("文档信息Id")]
        public int DocInfoId { get; set; }

        [Comment("标题")]
        public string Title { get; set; }

        [Comment("内容")]
        public string Content { get; set; }

        [Comment("操作时间")]
        public DateTime OperateAt { get; set; }

        [Comment("操作人")]
        public string OperateBy { get; set; }
    }
}