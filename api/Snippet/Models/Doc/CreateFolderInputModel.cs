using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Models.Doc
{
    public record CreateFolderInputModel(int spaceId, string name, int? upFolderId);
}
