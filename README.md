# SnippetDoc

一个在线文档编辑工具，支持富文本，代码和Markdown的在线编辑以及显示。

[demo](http://180.163.89.224:21001/login)

账号：admin/admin、user/user

每个账号首次登录时会生成自己的私有空间，公用空间权限由管理员进行生成和设置。

编辑器：

- 富文本：tinymce
- 代码：monaco editor
- Markdown：react-markdown

系统权限：

- 管理员：空间管理，用户管理，文档功能
- 用户：文档功能

空间权限

- 管理员：查看，编辑，设置空间成员
- 编辑者：查看，编辑
- 观察者：查看

运行

- 后端为.net 5前端为react，可以直接在编辑器开发调试，数据库在appsetting中配置好链接会自动生成
- 本地部署可以直接docker-compose up -d --build，前端访问后端的地址配置在volumns/web/config.json的server_url节点
