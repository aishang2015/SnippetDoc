using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Models.Doc
{
    public record GetDocsOutputModel(int Id, string Name, string Content, string CreateBy,
        DateTime CreateAt, string UpdateBy, DateTime? UpdateAt);
}
