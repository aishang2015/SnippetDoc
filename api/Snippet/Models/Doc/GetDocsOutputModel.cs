using System;

namespace Snippet.Models.Doc
{
    public record GetDocsOutputModel(int Id, int DocType, string Title, string CreateBy,
        DateTime CreateAt, string UpdateBy, DateTime? UpdateAt);
}