using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Snippet.Business.Hubs.State
{
    public class StateHub : Hub<IStateClient>
    {
        public readonly static ConcurrentDictionary<int, string> DocUserEditDic =
            new ConcurrentDictionary<int, string>();

        public void BeginEdit(int docId)
        {
            var userName = Context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            DocUserEditDic.TryAdd(docId, userName);
        }

        public void EndEdit(int docId)
        {
            DocUserEditDic.Remove(docId, out string value);
        }

        public ConcurrentDictionary<int, string> GetUserEditDic()
        {
            return DocUserEditDic;
        }

        public override Task OnDisconnectedAsync(System.Exception exception)
        {
            var userName = Context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (DocUserEditDic.Values.Contains(userName))
            {
                var key = DocUserEditDic.First(kv => kv.Value == userName).Key;
                DocUserEditDic.Remove(key, out userName);
            }
            return base.OnDisconnectedAsync(exception);
        }
    }
}