using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Models.User
{
    public record GetUserByNameOutputModel(int userId, string userName);
}
