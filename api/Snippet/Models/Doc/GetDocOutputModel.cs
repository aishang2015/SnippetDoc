using System;
using System.Collections.Generic;

namespace Snippet.Models.Doc
{
    public record GetDocOutputModel(int Id, int? folderId, int DocType, string Title, string Content, string CreateBy,
        DateTime CreateAt, string UpdateBy, DateTime? UpdateAt)
    {
        public string CreatorAvatarColor { get; set; }
        public string CreatorAvatarText { get; set; }
        public string UpdatePersonAvatarColor { get; set; }
        public string UpdatePersonAvatarText { get; set; }
        public List<DocModifyUser> DocModifyUsers { get; set; }
    }

    public record DocModifyUser
    {
        public string UserName { get; set; }

        public string AvatarColor { get; set; }

        public string AvatarText { get; set; }
    }
}