using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Snippet.Business.Services;
using Snippet.Constants;
using Snippet.Core;
using Snippet.Core.Data;
using Snippet.Entity;
using Snippet.Models;
using Snippet.Models.Space;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class SpaceController : ControllerBase
    {
        private readonly SnippetDbContext _snippetDbContext;

        private readonly IUserService _userService;

        public SpaceController(
            SnippetDbContext snippetDbContext,
            IUserService userService)
        {
            _snippetDbContext = snippetDbContext;
            _userService = userService;
        }

        /// <summary>
        /// 创建空间
        /// </summary>
        [HttpPost]
        public async Task<CommonResult> CreateSpace(CreateSpaceInputModel model)
        {
            if (_snippetDbContext.Spaces.Any(s => s.Name == model.Name))
            {
                return this.FailCommonResult(MessageConstant.SPACE_ERROR_0002);
            };

            _snippetDbContext.Spaces.Add(new Space
            {
                Name = model.Name,
                Type = 1
            });
            await _snippetDbContext.SaveChangesAsync();
            return this.SuccessCommonResult(MessageConstant.SPACE_INFO_0001);
        }

        /// <summary>
        /// 更新空间
        /// </summary>
        [HttpPost]
        public async Task<CommonResult> UpdateSpace(UpdateSpaceInputModel model)
        {
            if (_snippetDbContext.Spaces.Any(s => s.Name == model.Name && s.Id != model.id))
            {
                return this.FailCommonResult(MessageConstant.SPACE_ERROR_0002);
            };

            var space = await _snippetDbContext.FindAsync<Space>(model.id);
            space.Name = model.Name;
            await _snippetDbContext.SaveChangesAsync();
            return this.SuccessCommonResult(MessageConstant.SPACE_INFO_0002);
        }

        /// <summary>
        /// 删除空间
        /// </summary>
        [HttpPost]
        public async Task<CommonResult> DeleteSpace(DeleteSpaceInputModel model)
        {
            if (_snippetDbContext.DocInfos.Any(d => d.SpaceId == model.id && !d.IsDelete))
            {
                return this.FailCommonResult(MessageConstant.SPACE_ERROR_0005);
            }

            var space = await _snippetDbContext.FindAsync<Space>(model.id);
            _snippetDbContext.Entry(space).State = EntityState.Deleted;
            await _snippetDbContext.SaveChangesAsync();
            return this.SuccessCommonResult(MessageConstant.SPACE_INFO_0003);
        }

        /// <summary>
        /// 获取自己能看到的空间列表
        /// </summary>
        [HttpPost]
        public CommonResult GetUserSpaceList()
        {
            var userName = _userService.GetUserName();

            // 查找用户能看到的所有空间，私有空间的名称是空，所以填充上“我的空间”
            var result = (from space in _snippetDbContext.Spaces
                          join spaceMember in _snippetDbContext.SpaceMembers on space.Id equals spaceMember.Id
                          where spaceMember.MemberName == userName
                          select new GetSpaceListOutputModel(space.Id, space.Name ?? "我的空间", spaceMember.MemberRole)).ToList();
            return this.SuccessCommonResult(result.OrderBy(d => d.role));
        }

        /// <summary>
        /// 取得管理空间列表
        /// </summary>
        [HttpPost]
        public async Task<CommonResult> GetManageSpaceList()
        {
            var isSystemManager = await _userService.IsSystemUserAsync();
            if (!isSystemManager)
            {
                return this.FailCommonResult(MessageConstant.SPACE_ERROR_0001);
            }

            // 查询所有非私有空间的空间进行管理
            var result = from space in _snippetDbContext.Spaces
                         let subquery = (from sm in _snippetDbContext.SpaceMembers
                                         where space.Id == sm.SpaceId
                                         group sm by sm.SpaceId).ToList()
                         where space.Type == 1
                         orderby space.Id descending
                         select new GetManageSpaceListOutputModel(space.Id, space.Name, subquery.Count());

            return this.SuccessCommonResult(result);
        }

        /// <summary>
        /// 获取空间成员
        /// </summary>
        [HttpPost]
        public CommonResult GetSpaceMemberList(GetSpaceMemberListInputModel model)
        {
            var result = (from sm in _snippetDbContext.SpaceMembers
                          where sm.SpaceId == model.spaceId
                          select new GetSpaceMemberListOutputModel(sm.MemberName, sm.MemberRole))
                          .Skip((model.page - 1) * model.size)
                          .Take(model.size);
            return this.SuccessCommonResult(result);
        }

        /// <summary>
        /// 添加空间成员
        /// </summary>

        [HttpPost]
        public async Task<CommonResult> AddSpaceMember(AddSpaceMemberInputModel model)
        {
            // 添加空间成员
            await _snippetDbContext.SpaceMembers.AddAsync(new SpaceMember
            {
                SpaceId = model.spaceId,
                MemberName = model.userName,
                MemberRole = model.role
            });
            await _snippetDbContext.SaveChangesAsync();

            return this.SuccessCommonResult();
        }

        /// <summary>
        /// 删除空间成员
        /// </summary>
        [HttpPost]
        public async Task<CommonResult> RemoveSpaceMember(RemoveSpaceMemberInputModel model)
        {
            // 删除空间成员
            var sm = _snippetDbContext.SpaceMembers.Find(model.spaceId);
            _snippetDbContext.SpaceMembers.Remove(sm);
            await _snippetDbContext.SaveChangesAsync();
            return this.SuccessCommonResult();
        }
    }
}