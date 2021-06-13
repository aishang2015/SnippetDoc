using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Snippet.Core.Data;
using Snippet.Models;
using Snippet.Models.User;
using System.Linq;

namespace Snippet.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly SnippetDbContext _snippetDbContext;

        public UserController(SnippetDbContext snippetDbContext)
        {
            _snippetDbContext = snippetDbContext;
        }

        [HttpPost]
        public CommonResult SearchUserByName(GetUserByNameInputModel model)
        {
            var result = from u in _snippetDbContext.Users
                         where u.UserName.Contains(model.name)
                         select new GetUserByNameOutputModel(
                            u.Id, u.UserName);
            return this.SuccessCommonResult(result);
        }
    }
}
