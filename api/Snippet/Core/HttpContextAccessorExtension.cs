using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Security.Claims;

namespace Snippet.Core
{
    public static class HttpContextAccessorExtension
    {
        public static string GetCurrentUserClaim(this IHttpContextAccessor httpContextAccessor, string claimType)
        {
            return httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(c => c.Type == claimType)
                ?.Value ?? string.Empty;
        }
    }
}
