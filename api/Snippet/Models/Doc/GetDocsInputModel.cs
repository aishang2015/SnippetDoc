using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Models.Doc
{
    public record GetDocsInputModel(int page, int size, int spaceId, int? folderId, string name);
}
