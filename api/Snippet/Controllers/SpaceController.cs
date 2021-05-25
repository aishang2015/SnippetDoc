using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Snippet.Business.Services;
using Snippet.Constants;
using Snippet.Core;
using Snippet.Core.Data;
using Snippet.Entity;
using Snippet.Models;
using Snippet.Models.Space;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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

        [HttpPost]
        public async Task<CommonResult> CreateSpace(CreateSpaceInputModel model)
        {
            _snippetDbContext.Spaces.Add(new Space
            {
                Name = model.Name
            });
            await _snippetDbContext.SaveChangesAsync();
            return this.SuccessCommonResult(MessageConstant.SPACE_INFO_0001);
        }

        [HttpPost]
        public async Task<CommonResult> UpdateSpace(UpdateSpaceInputModel model)
        {
            var space = await _snippetDbContext.FindAsync<Space>(model.id);
            space.Name = model.Name;
            await _snippetDbContext.SaveChangesAsync();
            return this.SuccessCommonResult(MessageConstant.SPACE_INFO_0002);
        }

        [HttpPost]
        public async Task<CommonResult> DeleteSpace(DeleteSpaceInputModel model)
        {
            var space = await _snippetDbContext.FindAsync<Space>(model.id);
            _snippetDbContext.Entry(space).State = EntityState.Deleted;
            await _snippetDbContext.SaveChangesAsync();
            return this.SuccessCommonResult(MessageConstant.SPACE_INFO_0003);
        }

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
                         let spaceMemberGroup = (from spaceMember in _snippetDbContext.SpaceMembers
                                                 where spaceMember.MemberRole != 0 && space.Id == spaceMember.SpaceId
                                                 group spaceMember by spaceMember.SpaceId into spaceMemberGroup
                                                 select new { Key = spaceMemberGroup.Key, Count = spaceMemberGroup.Count() }).ToList()
                         join sm in _snippetDbContext.SpaceMembers on space.Id equals sm.SpaceId
                         where sm.MemberRole != 0
                         select new GetManageSpaceListOutputModel(space.Id, space.Name, spaceMemberGroup.Count());

            return this.SuccessCommonResult(result);
        }

        [HttpPost]
        public CommonResult GetSpaceMemberList(GetSpaceMemberListInputModel model)
        {
            var result = _snippetDbContext.SpaceMembers.Where(sm => sm.SpaceId == model.spaceId)
                .Skip((model.page - 1) * model.size).Take(model.size);
            return this.SuccessCommonResult(result);
        }

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
