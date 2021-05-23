using Microsoft.Extensions.DependencyInjection;

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
