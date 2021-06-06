namespace Snippet.Constants
{
    public static class MessageConstant
    {
        #region Common
        public static readonly (string, string) EMPTYTUPLE = (string.Empty, string.Empty);
        public static readonly (string, string) SYSTEM_ERROR_001 = ("SYSTEM_ERROR_001", "发生系统错误！请联系管理员！");
        #endregion

        #region AccountController
        public static readonly (string, string) ACCOUNT_INFO_0001 = ("ACCOUNT_INFO_0001", "登录成功！");
        public static readonly (string, string) ACCOUNT_INFO_0002 = ("ACCOUNT_INFO_0002", "第三方信息获取成功，请绑定您的账号！");

        public static readonly (string, string) ACCOUNT_ERROR_0001 = ("ACCOUNT_ERROR_0001", "账号或密码错误！");
        public static readonly (string, string) ACCOUNT_ERROR_0002 = ("ACCOUNT_ERROR_0002", "请输入账号！");
        public static readonly (string, string) ACCOUNT_ERROR_0003 = ("ACCOUNT_ERROR_0003", "请输入密码！");
        public static readonly (string, string) ACCOUNT_ERROR_0004 = ("ACCOUNT_ERROR_0004", "无法识别的第三方登录类型！");
        public static readonly (string, string) ACCOUNT_ERROR_0005 = ("ACCOUNT_ERROR_0005", "第三方登录类型不能是空！");
        public static readonly (string, string) ACCOUNT_ERROR_0006 = ("ACCOUNT_ERROR_0006", "第三方信息缓存密钥不能是空！");
        public static readonly (string, string) ACCOUNT_ERROR_0007 = ("ACCOUNT_ERROR_0007", "第三方账号信息已过期，请返回登陆页面重试！");
        #endregion

        #region FileController 

        public static readonly (string, string) FILE_ERROR_0001 = ("FILE_ERROR_0001", "文件不能为空！");


        #endregion

        #region SpaceController
        public static readonly (string, string) SPACE_INFO_0001 = ("SPACE_INFO_0001", "空间创建成功！");
        public static readonly (string, string) SPACE_INFO_0002 = ("SPACE_INFO_0002", "空间更新成功！");
        public static readonly (string, string) SPACE_INFO_0003 = ("SPACE_INFO_0003", "空间删除成功！");


        public static readonly (string, string) SPACE_ERROR_0001 = ("SPACE_ERROR_0001", "非系统管理员无法查看所有空间！");

        #endregion

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

        #endregion
    }
}
