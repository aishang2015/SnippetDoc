using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Snippet.Models;
using System.Linq;

namespace Snippet.Core
{
    public static class ApiBehaviorExtension
    {
        public static IServiceCollection ConfigureApiBehavior(this IServiceCollection services)
        {
            services.Configure<ApiBehaviorOptions>(options =>
            {
                // 覆盖ModelState管理的默认行为,将netcore的400错误统一为CommonResult形式的错误
                options.InvalidModelStateResponseFactory = (context) =>
                {
                    var keyValuePair = context.ModelState.FirstOrDefault();
                    return new OkObjectResult(new CommonResult
                    {
                        IsSuccess = false,
                        Code = keyValuePair.Key,
                        Message = keyValuePair.Value.Errors[0].ErrorMessage
                    });
                };
            });

            return services;
        }
    }
}
