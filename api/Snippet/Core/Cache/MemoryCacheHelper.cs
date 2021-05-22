using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Core.Cache
{
    /// <summary>
    /// 内存缓存帮助器
    /// </summary>
    /// <remarks>
    /// 主要是用来做集合缓存的
    /// </remarks>
    public class MemoryCacheHelper
    {
        private readonly IMemoryCache _memoryCache;

        public MemoryCacheHelper(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        public async Task<IEnumerable<TEntity>> CacheAsync<TEntity>(IQueryable<TEntity> query)
        {
            return await _memoryCache.GetOrCreateAsync<IEnumerable<TEntity>>(typeof(TEntity).Name,
                async entity => await query.ToListAsync());
        }

        public IEnumerable<TEntity> Cache<TEntity>(IQueryable<TEntity> query)
        {
            return _memoryCache.GetOrCreate<IEnumerable<TEntity>>(typeof(TEntity).Name,
                entity => query.ToList());
        }

        public IEnumerable<TEntity> Cache<TEntity>()
        {
            return _memoryCache.TryGetValue(typeof(TEntity).Name, out IEnumerable<TEntity> result) ?
                result : new List<TEntity>();
        }

        public void NoCache<TEntity>()
        {
            _memoryCache.Remove(typeof(TEntity).Name);
        }
    }
}
