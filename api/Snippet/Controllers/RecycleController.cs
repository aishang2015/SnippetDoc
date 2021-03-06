using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Snippet.Business.Services;
using Snippet.Constants;
using Snippet.Core.Data;
using Snippet.Models;
using Snippet.Models.Recycle;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RecycleController : ControllerBase
    {
        private readonly SnippetDbContext _snippetDbContext;

        private readonly IUserService _userService;

        private readonly ISpaceRightService _spaceRightService;

        public RecycleController(SnippetDbContext snippetDbContext, IUserService userService,
            ISpaceRightService spaceRightService)
        {
            _snippetDbContext = snippetDbContext;
            _userService = userService;
            _spaceRightService = spaceRightService;
        }

        [HttpPost]
        [ProducesResponseType(typeof(CommonResult<PagedModel<GetDeletedDocsOutputModel>>), 200)]
        public CommonResult GetDeletedDocs(GetDeletedDocsInputModel inputModel)
        {
            var userName = _userService.GetUserName();

            var haveRight = (from space in _snippetDbContext.Spaces.AsNoTracking()
                             join spaceMember in _snippetDbContext.SpaceMembers on space.Id equals spaceMember.SpaceId
                             where space.Id == inputModel.spaceId &&
                                 spaceMember.MemberName == userName &&
                                 spaceMember.MemberRole != 3
                             select space.Id).Any();

            if (haveRight)
            {
                var query = from d in _snippetDbContext.DocInfos.AsNoTracking()
                            join s in _snippetDbContext.Spaces.AsNoTracking() on d.SpaceId equals s.Id
                            where d.IsDelete && d.SpaceId == inputModel.spaceId
                            select new GetDeletedDocsOutputModel(d.Id, d.DocType, s.Name, d.Title,
                                d.Content, d.CreateBy, d.CreateAt, d.UpdateBy, d.UpdateAt);

                var take = inputModel.size;
                var skip = (inputModel.page - 1) * inputModel.size;

                return this.SuccessCommonResult(new PagedModel<GetDeletedDocsOutputModel>
                {
                    Total = query.Count(),
                    PagedData = query.Skip(skip).Take(take)
                });
            }
            else
            {
                return this.SuccessCommonResult(new PagedModel<GetDeletedDocsOutputModel>
                {
                    Total = 0,
                    PagedData = new List<GetDeletedDocsOutputModel>()
                });
            }
        }

        [HttpPost]
        public async Task<CommonResult> RevertDeleteDoc(RevertDeleteDocInputModel model)
        {
            var doc = _snippetDbContext.DocInfos.Find(model.id);

            // 校验空间业务权限
            if (!_spaceRightService.CanEditSpace(doc.SpaceId))
            {
                return this.FailCommonResult(MessageConstant.SPACE_ERROR_0009);
            }

            doc.IsDelete = false;
            await _snippetDbContext.SaveChangesAsync();
            return this.SuccessCommonResult(MessageConstant.ERCYCLE_INFO_0001);
        }

        [HttpPost]
        public async Task<CommonResult> PhysicsDeleteDoc(PhysicsDeleteDocInputModel model)
        {
            var doc = _snippetDbContext.DocInfos.Find(model.id);

            // 校验空间业务权限
            if (!_spaceRightService.CanEditSpace(doc.SpaceId))
            {
                return this.FailCommonResult(MessageConstant.SPACE_ERROR_0009);
            }

            _snippetDbContext.DocInfos.Remove(doc);

            var docHistories = _snippetDbContext.DocHistories.Where(dh => dh.DocInfoId == model.id);
            _snippetDbContext.DocHistories.RemoveRange(docHistories);

            var docFiles = _snippetDbContext.DocFiles.Where(dh => dh.DocInfoId == model.id);
            _snippetDbContext.DocFiles.RemoveRange(docFiles);

            await _snippetDbContext.SaveChangesAsync();
            return this.SuccessCommonResult(MessageConstant.ERCYCLE_INFO_0002);
        }
    }
}