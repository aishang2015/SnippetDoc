using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Snippet.Business.Hubs;
using Snippet.Business.Hubs.State;
using Snippet.Business.Services;
using Snippet.Business.Workers;

namespace Snippet.Business
{
    public static class BusinessExtension
    {
        public static IServiceCollection AddWorks(this IServiceCollection services)
        {
            services.AddHostedService<StateWorker>();
            services.AddHostedService<BroadcastWorker>();
            return services;
        }

        public static IEndpointRouteBuilder MapHubs(this IEndpointRouteBuilder endpoints)
        {
            endpoints.MapHub<StateHub>("/state");
            endpoints.MapHub<BroadcastHub>("/broadcast");
            return endpoints;
        }

        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
            return services;
        }
    }
}