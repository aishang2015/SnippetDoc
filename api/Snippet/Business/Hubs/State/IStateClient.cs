using System.Collections;
using System.Threading.Tasks;

namespace Snippet.Business.Hubs.State
{
    public interface IStateClient
    {
        Task GetEditingDic(IEnumerable data);
    }
}
