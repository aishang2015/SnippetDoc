using System.Collections.Generic;

namespace Snippet.Constants
{
    public class CommonConstant
    {
        public const string Github = "github";
        public const string Baidu = "baidu";

        public const string SystemManagerRole = "系统管理员";
        public const string CommomUserRole = "普通用户";

        public static readonly Dictionary<int, string> RoleDic = new Dictionary<int, string>
        {
            {1,"系统管理员" },
            {2,"用户" }
        };

        public static readonly Dictionary<int, string> SpaceRoleDic = new Dictionary<int, string>
        {
            {1,"管理员" },
            {2,"编辑者" },
            {3,"观察者" }
        };
    }
}