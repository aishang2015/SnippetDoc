using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Models.Doc
{
    public record CreateDocInputModel(int spaceId, int? folderId, string name, string content);
}
