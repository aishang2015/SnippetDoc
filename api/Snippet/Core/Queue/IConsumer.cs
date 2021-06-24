using System.Threading.Tasks;

namespace Snippet.Core.Queue
{
    public interface IConsumer<T>
    {
        public Task ConsumeAsync(T t);
    }
}