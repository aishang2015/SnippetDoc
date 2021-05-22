using Microsoft.Extensions.DependencyInjection;
using Snippet.Core.Utils;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Core.Queue
{
    /// <summary>
    /// 简易内存消息队列
    /// </summary>
    /// <remarks>
    /// 使用方式
    /// 首先注册队列
    /// services.AddSingleton<MemoryMessageQueue<Model>>();
    /// 然后实现消费者，可以实现多个
    /// SomeConsumer：IConsumer<Model>
    /// 并注册到容器
    /// services.AddScope<SomeConsumer>();
    /// 使用
    /// 直接注入MemoryMessageQueue<Model>对象并使用produce方法即可
    /// </remarks>
    public class MemoryMessageQueue<T>
    {
        private BlockingCollection<T> _collection = new BlockingCollection<T>();

        private List<IConsumer<T>> _consumers = new List<IConsumer<T>>();

        public MemoryMessageQueue(IServiceProvider serviceProvider)
        {
            // 在容器中寻找消费者对象
            BindConsumers(serviceProvider);

            // 开始执行消费线程
            StartConsume();
        }

        /// <summary>
        /// 生产消息
        /// </summary>
        /// <param name="t"></param>
        public void Produce(T t)
        {
            _collection.Add(t);
        }

        /// <summary>
        /// 绑定消费者
        /// </summary>
        private void BindConsumers(IServiceProvider serviceProvider)
        {
            var types = ReflectionUtil.GetSubClass<IConsumer<T>>();
            foreach (var type in types)
            {
                using var scope = serviceProvider.CreateScope();
                var consumer = scope.ServiceProvider.GetService(type);
                if (consumer != null)
                {
                    _consumers.Add(consumer as IConsumer<T>);
                }
            }
        }

        /// <summary>
        /// 开始消费
        /// </summary>
        private void StartConsume()
        {
            Task.Factory.StartNew(() =>
            {
                while (!_collection.IsCompleted)
                {
                    var message = _collection.Take();
                    _consumers.AsParallel().WithDegreeOfParallelism(2)
                        .ForAll(async consumer => await consumer.ConsumeAsync(message));
                }
            }, TaskCreationOptions.LongRunning);
        }

    }
}
