using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Core.Cache
{
    public static class MemoryCacheExtension
    {
        public static IServiceCollection AddMemoryCacheHelper(this IServiceCollection services)
        {
            services.AddScoped<MemoryCacheHelper>();
            return services.AddMemoryCache();
        }


    }
}
