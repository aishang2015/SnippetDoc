using System;

namespace Snippet.Models.Doc
{
    public record GetDocsOutputModel(int Id, int DocType, string Title, string CreateBy,
        DateTime CreateAt, string UpdateBy, DateTime? UpdateAt)
    {
        public string CreatorAvatarColor { get; set; }
        public string CreatorAvatarText { get; set; }
        public string UpdatePersonAvatarColor { get; set; }
        public string UpdatePersonAvatarText { get; set; }
    }
}