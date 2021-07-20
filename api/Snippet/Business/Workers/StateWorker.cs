using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Snippet.Business.Hubs.State;
using System.Threading;
using System.Threading.Tasks;

namespace Snippet.Business.Workers
{
    public class StateWorker : BackgroundService
    {
        private readonly IHubContext<StateHub, IStateClient> _stateHub;

        public StateWorker(IHubContext<StateHub, IStateClient> stateHub)
        {
            _stateHub = stateHub;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await _stateHub.Clients.All.GetEditingDic(StateHub.DocUserEditDic);
                await Task.Delay(3000);
            }
        }
    }
}
