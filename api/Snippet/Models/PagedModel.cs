using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Models
{
    public class PagedModel<T>
    {
        public int Total { get; set; }
        public IEnumerable<T> Data { get; set; }
    }
}
