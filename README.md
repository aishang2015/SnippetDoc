# Snippet

使用.net5和react的初始模板，没有业务代码只实现了简单登录。

#### 使用技术

后端：AutoMapper，FluentValidation，Identity，EntityFrameworkCore，Refit，Serilog，SkyAPM，Swashbuckle，SignalR，BackgroundService，IDistributedCache，MiniProfiler

前端：create-react-app，antd，craco，axios，redux，react-router，signalr

#### 从docker启动

docker-compose up -d --build 

然后打开连接

[Web](http://localhost:21001/home)

[SkyWalking](http://localhost:9898/)

#### 目录说明

- api\Snippet

  - Business

    这个文件夹主要用来存放SignalR的hub，BackgroundService，MediatR通知或自定义Service的一些逻辑,相关的注册信息写入BusinessExtension.cs。

  - Constants

    主要是用来记录程序中出现的常量，其中业务消息常量定义为(string, string)元组形式，其中第一个值作为消息编码，第二个值定义为消息内容。消息编码可以作为前端处理某些业务流程的凭据。

  - Controllers

    所有的api使用rpc风格，post一把梭。所有响应都使用CommonResult进行封装，异步接口返回Task&lt;CommonResult&gt; 

  - Core

    - Authentication

      jwt授权

    - Cache

      实现对IDistributedCache的配置，支持内存，sqlserver和redis，在配置文件中通过CacheOption进行配置。DistributeCacheExtension类扩展了IDistributedCache针对对象缓存的方法。

    - Data

      数据库上下文的不同数据源的配置，支持SQLite，SQLServer，MySQL，PostgreSQL，Oracle，在配置文件中通过DatabaseOption进行配置。DatabaseInitializer提供了code first模式的初始数据，在程序启动时创建并初始化数据。

    - Middleware

      包含一个全局异常捕获中间件。配置了一个Serilog的请求中间件，将请求时间超过一定值的请求进行警告打印。

    - Oauth

      使用Refit简化httpclient调用，实现了Baidu和Github的OAuth认证。使用时需要在前后端的配置文件中对appid和appsecret和returnurl等进行进行配置。

    - Queue

      一个简单的内存消息队列。举例：创建一个消息类MessageModel.cs,继承IConsumer实现对MessageModel的消费者类MessageConsumer,然后将消费者和消息队列进行注册

      services.AddSingleton&lt;MemoryMessageQueue&lt;MessageModel&gt;&gt; ()

      services.AddScope&lt;MessageConsumer&gt; ();

      然后在应用中注入MemoryMessageQueue&lt;MessageModel&gt;  queue，使用queue.Produce进行消费即可。

      每个队列支持多个消费者，内部使用PLinq进行并行消费

    - Utils

      包含日期，加密，程序集等工具类

  - Entity

    数据库实体定义

  - Models

    Input和Output模型，配置automapper，配置fluentvalidation，负责数据转换和校验

  - skyapm.json

    skyapm相关配置

- api\Snippet.IT

  集成测试工程，使用了Microsoft.EntityFrameworkCore.InMemory

- api\Snippet.UT

  xunit单元测试工程，引入了moq

- web

  - public\config

    配置后端地址，以及oauth的appid等

  - src\common

    工具方法等

  - src\components

    业务组件

  - src\http

    使用Axios ，通过创建AxiosInstance进行通信

  - src\pages

    业务页面

  - src\redux

    按照Action，Creator，Reducer，State的方式去使用redux
  
- volumns

  docker下的配置文件以及本地卷存放位置

#### 其他

百度Oauth设置地址：[管理控制台 - 百度开放云平台 (baidu.com)](http://developer.baidu.com/console#app/project)

githubOauth设置地址：[Developer applications (github.com)](https://github.com/settings/developers)
