using System;

namespace Snippet.Models.Doc
{
    public record GetDocOutputModel(int Id, int? folderId, int DocType, string Title, string Content, string CreateBy,
        DateTime CreateAt, string UpdateBy, DateTime? UpdateAt);
}
