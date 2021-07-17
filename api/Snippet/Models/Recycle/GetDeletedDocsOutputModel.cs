using System;

namespace Snippet.Models.Recycle
{
    public record GetDeletedDocsOutputModel(int Id, int DocType, string spaceName, string Title, string Content, string CreateBy,
        DateTime CreateAt, string UpdateBy, DateTime? UpdateAt);
}