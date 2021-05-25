using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Snippet.Constants;
using Snippet.Core;
using Snippet.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Snippet.Business.Services
{
    public interface IUserService
    {
        public string GetUserName();
        public Task<bool> IsSystemUserAsync();
    }

    public class UserService : IUserService
    {

        private readonly IHttpContextAccessor _httpContextAccessor;

        private readonly UserManager<SnippetUser> _userManager;

        public UserService(IHttpContextAccessor httpContextAccessor,
            UserManager<SnippetUser> userManager)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
        }

        public string GetUserName() =>
            _httpContextAccessor.GetCurrentUserClaim(ClaimTypes.NameIdentifier);

        public async Task<bool> IsSystemUserAsync()
        {
            var userName = _httpContextAccessor.GetCurrentUserClaim(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByNameAsync(userName);
            return await _userManager.IsInRoleAsync(user, CommonConstant.SystemManagerRole);
        }
    }
}
