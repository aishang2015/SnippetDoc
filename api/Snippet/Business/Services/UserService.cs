using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Distributed;
using Snippet.Constants;
using Snippet.Core;
using Snippet.Entity;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Snippet.Business.Services
{

    public enum UseInfoType
    {
        AvatarColor,
        AvatarText
    };

    public interface IUserService
    {
        public string GetUserName();

        public Task<bool> IsSystemUserAsync();

        public void LoadUserCache();

        public void UpdateUserCache(SnippetUser user);

        public SnippetUser GetCacheUser(string userName);

        public string GetCacheUserValue(string userName, UseInfoType type);
    }

    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        private readonly UserManager<SnippetUser> _userManager;

        private readonly IDistributedCache _distributedCache;

        public UserService(IHttpContextAccessor httpContextAccessor,
            UserManager<SnippetUser> userManager,
            IDistributedCache distributedCache)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _distributedCache = distributedCache;
        }

        public string GetUserName() =>
            _httpContextAccessor.GetCurrentUserClaim(ClaimTypes.NameIdentifier);

        public async Task<bool> IsSystemUserAsync()
        {
            var userName = _httpContextAccessor.GetCurrentUserClaim(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByNameAsync(userName);
            return await _userManager.IsInRoleAsync(user, CommonConstant.SystemManagerRole);
        }

        /// <summary>
        /// 将用户信息加载到缓存
        /// </summary>
        public void LoadUserCache()
        {
            foreach (var user in _userManager.Users)
            {
                _distributedCache.SetString($"{user.UserName}-AvatarColor", user.AvatarColor);
                _distributedCache.SetString($"{user.UserName}-AvatarText", user.AvatarText);
            }
        }

        /// <summary>
        /// 更新用户缓存
        /// </summary>
        public void UpdateUserCache(SnippetUser user)
        {
            _distributedCache.SetString($"{user.UserName}-AvatarColor", user.AvatarColor);
            _distributedCache.SetString($"{user.UserName}-AvatarText", user.AvatarText);
        }

        /// <summary>
        /// 获取用户缓存信息
        /// </summary>
        public SnippetUser GetCacheUser(string userName)
        {
            return new SnippetUser
            {
                UserName = userName,
                AvatarColor = _distributedCache.GetString($"{userName}-AvatarColor"),
                AvatarText = _distributedCache.GetString($"{userName}-AvatarText")
            };
        }

        /// <summary>
        /// 获取用户缓存信息值
        /// </summary>
        public string GetCacheUserValue(string userName, UseInfoType type)
        {
            return type switch
            {
                UseInfoType.AvatarColor => _distributedCache.GetString($"{userName}-AvatarColor"),
                UseInfoType.AvatarText => _distributedCache.GetString($"{userName}-AvatarText"),
                _ => null
            };
        }
    }
}