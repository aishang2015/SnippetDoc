using Microsoft.EntityFrameworkCore;
using System;

namespace Snippet.Entity
{
    [Comment("文档信息")]
    public class DocInfo
    {
        public int Id { get; set; }

        [Comment("空间Id")]
        public int SpaceId { get; set; }

        [Comment("文件夹Id")]
        public int? FolderId { get; set; }

        [Comment("名称")]
        public string Name { get; set; }

        [Comment("内容")]
        public string Content { get; set; }

        public int CreateBy { get; set; }

        public DateTime CreateAt { get; set; }

        public int? UpdateBy { get; set; }

        public DateTime? UpdateAt { get; set; }
    }
}
