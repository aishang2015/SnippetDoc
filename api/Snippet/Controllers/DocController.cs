using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Snippet.Business.Services;
using Snippet.Constants;
using Snippet.Core.Data;
using Snippet.Entity;
using Snippet.Models;
using Snippet.Models.Doc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class DocController : ControllerBase
    {
        private readonly SnippetDbContext _snippetDbContext;

        private readonly IUserService _userService;

        public DocController(SnippetDbContext snippetDbContext, IUserService userService)
        {
            _snippetDbContext = snippetDbContext;
            _userService = userService;
        }

        [HttpPost]
        [ProducesResponseType(typeof(CommonResult<GetDocsOutputModel>), 200)]
        public CommonResult GetDocs(GetDocsInputModel model)
        {
            var query = from d in _snippetDbContext.DocInfos.AsNoTracking()
                        where d.SpaceId == model.spaceId &&
                            d.FolderId == model.folderId &&
                            !d.IsDelete
                        select new GetDocsOutputModel(d.Id, d.DocType, d.Title, d.CreateBy,
                            d.CreateAt, d.UpdateBy, d.UpdateAt);

            return this.SuccessCommonResult(query);
        }

        [HttpPost]
        [ProducesResponseType(typeof(CommonResult<GetDocOutputModel>), 200)]
        public CommonResult GetDoc(GetDocInputModel model)
        {
            var resultList = (from d in _snippetDbContext.DocInfos.AsNoTracking()
                              where d.Id == model.id
                              select new GetDocOutputModel(d.Id, d.FolderId, d.DocType, d.Title, d.Content, d.CreateBy,
                                  d.CreateAt, d.UpdateBy, d.UpdateAt)).ToList();
            if (resultList.Count() == 0)
            {
                return this.FailCommonResult(MessageConstant.DOC_ERROR_001);
            }
            return this.SuccessCommonResult(resultList.First());
        }

        [HttpPost]
        public async Task<CommonResult> CreateDoc(CreateDocInputModel model)
        {
            var now = DateTime.Now;

            // 开启事务
            using var trans = await _snippetDbContext.Database.BeginTransactionAsync();

            // 保存文档信息
            var entity = await _snippetDbContext.DocInfos.AddAsync(new DocInfo
            {
                SpaceId = model.spaceId,
                FolderId = model.folderId,
                DocType = model.DocType,
                Title = model.title,
                Content = model.content,
                CreateAt = now,
                CreateBy = _userService.GetUserName(),
                IsDelete = false
            });
            await _snippetDbContext.SaveChangesAsync();

            // 保存文档历史
            await _snippetDbContext.DocHistories.AddAsync(new DocHistory
            {
                DocInfoId = entity.Entity.Id,
                Title = model.title,
                Content = model.content,
                RecordAt = now
            });
            await _snippetDbContext.SaveChangesAsync();

            // 提交事务
            await trans.CommitAsync();
            return this.SuccessCommonResult(MessageConstant.DOC_INFO_001);
        }

        [HttpPost]
        public async Task<CommonResult> UpdateDoc(UpdateDocInputModel model)
        {
            var userName = _userService.GetUserName();
            var now = DateTime.Now;

            // 更新内容
            var doc = _snippetDbContext.DocInfos.Find(model.id);
            doc.Title = model.title;
            doc.Content = model.content;
            doc.UpdateBy = userName;
            doc.UpdateAt = now;

            // 取得最新一次的记录
            var latestHistory = (from h in _snippetDbContext.DocHistories
                                 where h.DocInfoId == model.id
                                 orderby h.RecordAt descending
                                 select h).First();

            // 如果上一次修改时间距现在超过30分钟后，则会生成新的历史记录
            if (latestHistory.RecordAt.AddMinutes(30) < now)
            {
                await _snippetDbContext.DocHistories.AddAsync(new DocHistory
                {
                    DocInfoId = doc.Id,
                    Title = model.title,
                    Content = model.content,
                    RecordAt = now
                });
            }

            await _snippetDbContext.SaveChangesAsync();

            return this.SuccessCommonResult(MessageConstant.DOC_INFO_002);
        }

        [HttpPost]
        public async Task<CommonResult> DeleteDoc(DeleteDocInputModel model)
        {
            var doc = _snippetDbContext.DocInfos.Find(model.id);
            doc.IsDelete = true;
            await _snippetDbContext.SaveChangesAsync();
            return this.SuccessCommonResult(MessageConstant.DOC_INFO_003);
        }
    }
}