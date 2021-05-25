using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Models.Space
{
    public record RemoveSpaceMemberInputModel(int spaceId, string userName);
}
