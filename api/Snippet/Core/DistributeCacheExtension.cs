using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using System.Threading.Tasks;

namespace Snippet.Core
{
    public static class DistributeCacheExtension
    {
        #region 异步方法

        /// <summary>
        /// 设置对象
        /// </summary>
        public static async Task SetAsync<T>(this IDistributedCache cache, string key, T t,
            DistributedCacheEntryOptions options = null) where T : class
        {
            var json = JsonSerializer.Serialize(t);
            await cache.SetStringAsync(key, json, options);
        }

        /// <summary>
        /// 取得对象
        /// </summary>
        public static async Task<T> GetAsync<T>(this IDistributedCache cache, string key)
             where T : class
        {
            var json = await cache.GetStringAsync(key);
            return json is null ? null : JsonSerializer.Deserialize<T>(json);
        }

        #endregion

        #region 同步方法

        /// <summary>
        /// 设置对象
        /// </summary>
        public static void Set<T>(this IDistributedCache cache, string key, T t,
            DistributedCacheEntryOptions options = null) where T : class
        {
            var json = JsonSerializer.Serialize(t);
            cache.SetString(key, json, options);
        }

        /// <summary>
        /// 取得对象
        /// </summary>
        public static T Get<T>(this IDistributedCache cache, string key) where T : class
        {
            var json = cache.GetString(key);
            return json is null ? null : JsonSerializer.Deserialize<T>(json);
        }
        #endregion
    }
}
