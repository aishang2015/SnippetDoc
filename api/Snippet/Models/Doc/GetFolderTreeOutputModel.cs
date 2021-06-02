using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Models.Doc
{
    public record GetFolderTreeOutputModel(int id, int? upId, string name);
}
