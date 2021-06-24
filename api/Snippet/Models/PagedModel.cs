using System.Collections.Generic;

namespace Snippet.Models
{
    public class PagedModel<T>
    {
        public int Total { get; set; }
        public IEnumerable<T> PagedData { get; set; }
    }
}