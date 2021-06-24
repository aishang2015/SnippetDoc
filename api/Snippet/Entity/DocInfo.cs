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

        [Comment("逻辑删除标识")]
        public bool IsDelete { get; set; }

        [Comment("创建人")]
        public string CreateBy { get; set; }

        [Comment("创建时间")]
        public DateTime CreateAt { get; set; }

        [Comment("更新人")]
        public string UpdateBy { get; set; }

        [Comment("更新时间")]
        public DateTime? UpdateAt { get; set; }
    }
}