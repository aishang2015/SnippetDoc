namespace Snippet.Constants
{
    public static class MessageConstant
    {
        #region Common

        public static readonly (string, string) EMPTYTUPLE = (string.Empty, string.Empty);
        public static readonly (string, string) SYSTEM_ERROR_001 = ("SYSTEM_ERROR_001", "发生系统错误！请联系管理员！");

        #endregion Common

        #region AccountController

        public static readonly (string, string) ACCOUNT_INFO_0001 = ("ACCOUNT_INFO_0001", "登录成功！");
        public static readonly (string, string) ACCOUNT_INFO_0002 = ("ACCOUNT_INFO_0002", "第三方信息获取成功，请绑定您的账号！");
        public static readonly (string, string) ACCOUNT_INFO_0003 = ("ACCOUNT_INFO_0003", "头像信息更新成功！");
        public static readonly (string, string) ACCOUNT_INFO_0004 = ("ACCOUNT_INFO_0004", "密码修改完毕！");

        public static readonly (string, string) ACCOUNT_ERROR_0001 = ("ACCOUNT_ERROR_0001", "账号或密码错误！");
        public static readonly (string, string) ACCOUNT_ERROR_0002 = ("ACCOUNT_ERROR_0002", "请输入账号！");
        public static readonly (string, string) ACCOUNT_ERROR_0003 = ("ACCOUNT_ERROR_0003", "请输入密码！");
        public static readonly (string, string) ACCOUNT_ERROR_0004 = ("ACCOUNT_ERROR_0004", "无法识别的第三方登录类型！");
        public static readonly (string, string) ACCOUNT_ERROR_0005 = ("ACCOUNT_ERROR_0005", "第三方登录类型不能是空！");
        public static readonly (string, string) ACCOUNT_ERROR_0006 = ("ACCOUNT_ERROR_0006", "第三方信息缓存密钥不能是空！");
        public static readonly (string, string) ACCOUNT_ERROR_0007 = ("ACCOUNT_ERROR_0007", "第三方账号信息已过期，请返回登陆页面重试！");
        public static readonly (string, string) ACCOUNT_ERROR_0008 = ("ACCOUNT_ERROR_0008", "账号未激活！");
        public static readonly (string, string) ACCOUNT_ERROR_0009 = ("ACCOUNT_ERROR_0009", "旧密码错误！");
        public static readonly (string, string) ACCOUNT_ERROR_0010 = ("ACCOUNT_ERROR_0010", "新密码和旧密码不一致！");

        #endregion AccountController

        #region FileController

        public static readonly (string, string) FILE_ERROR_0001 = ("FILE_ERROR_0001", "文件不能为空！");

        #endregion FileController

        #region SpaceController

        public static readonly (string, string) SPACE_INFO_0001 = ("SPACE_INFO_0001", "空间创建成功！");
        public static readonly (string, string) SPACE_INFO_0002 = ("SPACE_INFO_0002", "空间更新成功！");
        public static readonly (string, string) SPACE_INFO_0003 = ("SPACE_INFO_0003", "空间删除成功！");
        public static readonly (string, string) SPACE_INFO_0004 = ("SPACE_INFO_0004", "成员添加成功！");
        public static readonly (string, string) SPACE_INFO_0005 = ("SPACE_INFO_0005", "成员角色更新成功！");
        public static readonly (string, string) SPACE_INFO_0006 = ("SPACE_INFO_0006", "成员移出成功！");

        public static readonly (string, string) SPACE_ERROR_0001 = ("SPACE_ERROR_0001", "非系统管理员无法查看所有空间！");
        public static readonly (string, string) SPACE_ERROR_0002 = ("SPACE_ERROR_0002", "空间名称重复！");
        public static readonly (string, string) SPACE_ERROR_0003 = ("SPACE_ERROR_0003", "空间名称不能为空！");
        public static readonly (string, string) SPACE_ERROR_0004 = ("SPACE_ERROR_0004", "空间名称过长！");
        public static readonly (string, string) SPACE_ERROR_0005 = ("SPACE_ERROR_0005", "空间中包含文档，无法删除！");
        public static readonly (string, string) SPACE_ERROR_0006 = ("SPACE_ERROR_0006", "此用户已经在此空间中！");
        public static readonly (string, string) SPACE_ERROR_0007 = ("SPACE_ERROR_0007", "空间中不存在该用户！");
        public static readonly (string, string) SPACE_ERROR_0008 = ("SPACE_ERROR_0008", "角色没有变化！");

        #endregion SpaceController

        #region DocController

        public static readonly (string, string) DOC_INFO_001 = ("DOC_INFO_001", "文档创建成功！");
        public static readonly (string, string) DOC_INFO_002 = ("DOC_INFO_002", "文档更新成功！");
        public static readonly (string, string) DOC_INFO_003 = ("DOC_INFO_003", "已放入回收站！");
        public static readonly (string, string) DOC_INFO_004 = ("DOC_INFO_004", "文档已恢复！");
        public static readonly (string, string) DOC_INFO_005 = ("DOC_INFO_005", "文档及所有记录已删除！");
        public static readonly (string, string) DOC_INFO_006 = ("DOC_INFO_006", "文件夹创建成功！");
        public static readonly (string, string) DOC_INFO_007 = ("DOC_INFO_007", "文件夹删除成功！");
        public static readonly (string, string) DOC_INFO_008 = ("DOC_INFO_008", "文件夹成功！");

        public static readonly (string, string) DOC_ERROR_001 = ("DOC_ERROR_001", "无法删除，文件夹包含文件！");
        public static readonly (string, string) DOC_ERROR_002 = ("DOC_ERROR_002", "上级文件夹不能指定为编辑中的文件夹！");

        #endregion DocController

        #region UserController

        public static readonly (string, string) USER_INFO_0001 = ("USER_INFO_0001", "用户创建完毕！");
        public static readonly (string, string) USER_INFO_0002 = ("USER_INFO_0002", "用户信息更新成功！");
        public static readonly (string, string) USER_INFO_0003 = ("USER_INFO_0003", "用户信息删除成功！");
        public static readonly (string, string) USER_INFO_0004 = ("USER_INFO_0004", "用户密码设定完成！");

        public static readonly (string, string) USER_ERROR_0001 = ("USER_ERROR_0001", "用户名重复！");
        public static readonly (string, string) USER_ERROR_0002 = ("USER_ERROR_0002", "用户名不能为空！");
        public static readonly (string, string) USER_ERROR_0003 = ("USER_ERROR_0003", "用户名长度不能超过20！");
        public static readonly (string, string) USER_ERROR_0004 = ("USER_ERROR_0004", "角色值非法！");
        public static readonly (string, string) USER_ERROR_0005 = ("USER_ERROR_0005", "请保留一个可用的管理员！");

        #endregion UserController
    }
}