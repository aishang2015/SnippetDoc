using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Snippet.Constants;
using Snippet.Core.Data;
using Snippet.Entity;
using Snippet.Models;
using Snippet.Models.User;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly SnippetDbContext _snippetDbContext;

        private readonly UserManager<SnippetUser> _userManager;

        public UserController(SnippetDbContext snippetDbContext,
            UserManager<SnippetUser> userManager)
        {
            _snippetDbContext = snippetDbContext;
            _userManager = userManager;
        }

        /// <summary>
        /// 通过username搜索用户
        /// </summary>
        [HttpPost]
        public CommonResult SearchUserByName(GetUserByNameInputModel model)
        {
            var result = from u in _snippetDbContext.Users
                         where u.UserName.Contains(model.name)
                         select new GetUserByNameOutputModel(
                            u.Id, u.UserName);
            return this.SuccessCommonResult(result);
        }

        /// <summary>
        /// 取得用户列表
        /// </summary>
        [HttpPost]
        public CommonResult GetUserList(GetUserListInputModel inputModel)
        {
            var query = from u in _snippetDbContext.Users
                        join ur in _snippetDbContext.UserRoles on u.Id equals ur.UserId
                        join r in _snippetDbContext.Roles on ur.RoleId equals r.Id
                        orderby u.Id
                        select new GetUserListOutputModel(
                            u.Id, u.UserName, r.Id, r.Name, u.IsActive);

            return this.SuccessCommonResult(new PagedModel<GetUserListOutputModel>
            {
                Total = query.Count(),
                PagedData = query.Skip((inputModel.page - 1) * inputModel.size).Take(inputModel.size)
            });
        }

        /// <summary>
        /// 添加用户
        /// </summary>
        [HttpPost]
        public async Task<CommonResult> CreateUser(CreateUserInputModel inputModel)
        {
            // 检查用户名
            var findUser = await _userManager.FindByNameAsync(inputModel.userName);
            if (findUser != null)
            {
                return this.FailCommonResult(MessageConstant.USER_ERROR_0001);
            }

            var user = new SnippetUser
            {
                UserName = inputModel.userName,
                IsActive = inputModel.isActive
            };
            await _userManager.CreateAsync(user);
            await _userManager.AddToRoleAsync(user, CommonConstant.RoleDic[inputModel.role]);

            return this.SuccessCommonResult(MessageConstant.USER_INFO_0001);
        }

        /// <summary>
        /// 更新用户
        /// </summary>
        [HttpPost]
        public async Task<CommonResult> UpdateUser(UpdateUserInputModel inputModel)
        {
            // 检查用户名
            if (_snippetDbContext.Users.Any(u =>
                u.UserName == inputModel.userName && u.Id != inputModel.userId))
            {
                return this.FailCommonResult(MessageConstant.USER_ERROR_0001);
            }

            // 开启事务
            using var trans = await _snippetDbContext.Database.BeginTransactionAsync();

            // 更新基本信息
            var user = await _userManager.FindByIdAsync(inputModel.userId.ToString());
            user.UserName = inputModel.userName;
            user.IsActive = inputModel.isActive;
            await _userManager.UpdateAsync(user);

            // 更新角色
            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Contains(CommonConstant.RoleDic[inputModel.role]))
            {
                await _userManager.RemoveFromRolesAsync(user, roles);
                await _userManager.AddToRoleAsync(user, CommonConstant.RoleDic[inputModel.role]);
            }

            if (!await ValidateHaveAdmin())
            {
                trans.Rollback();
                return this.FailCommonResult(MessageConstant.USER_ERROR_0005);
            }
            await trans.CommitAsync();

            return this.SuccessCommonResult(MessageConstant.USER_INFO_0002);
        }

        /// <summary>
        /// 删除用户
        /// </summary>
        [HttpPost]
        public async Task<CommonResult> DeleteUser(DeleteUserInputModel inputModel)
        {
            // 开启事务
            using var trans = await _snippetDbContext.Database.BeginTransactionAsync();

            // 删除用户
            var user = await _userManager.FindByIdAsync(inputModel.userId.ToString());
            user.IsDeleted = true;
            await _userManager.UpdateAsync(user);

            if (!await ValidateHaveAdmin())
            {
                trans.Rollback();
                return this.FailCommonResult(MessageConstant.USER_ERROR_0005);
            }
            await trans.CommitAsync();
            return this.SuccessCommonResult(MessageConstant.USER_INFO_0003);
        }

        /// <summary>
        /// 设置密码
        /// </summary>
        [HttpPost]
        public async Task<CommonResult> SetPassword(SetPasswordInputModel inputModel)
        {
            var user = await _userManager.FindByIdAsync(inputModel.userId.ToString());
            await _userManager.RemovePasswordAsync(user);
            await _userManager.AddPasswordAsync(user, inputModel.password);
            return this.SuccessCommonResult(MessageConstant.USER_INFO_0004);
        }

        /// <summary>
        /// 检查系统可用的管理员
        /// </summary>
        private async Task<bool> ValidateHaveAdmin()
        {
            var users = await _userManager.GetUsersInRoleAsync(CommonConstant.RoleDic[1]);
            return users.Where(u => u.IsActive).Count() > 0;
        }
    }
}