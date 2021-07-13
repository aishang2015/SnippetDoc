using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Models.Doc
{
    public record GetDocOutputModel(int Id,int? folderId, string Title, string Content, string CreateBy,
        DateTime CreateAt, string UpdateBy, DateTime? UpdateAt);
}
