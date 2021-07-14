using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Models.Recycle
{
    public record GetDeletedDocsOutputModel(int Id, int DocType, string spaceName, string Title, string Content, string CreateBy,
        DateTime CreateAt, string UpdateBy, DateTime? UpdateAt);
}
