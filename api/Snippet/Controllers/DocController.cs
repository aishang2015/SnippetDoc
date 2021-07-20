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
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
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
            var resultList = (from d in _snippetDbContext.DocInfos.AsNoTracking()
                              where d.SpaceId == model.spaceId &&
                                  d.FolderId == model.folderId &&
                                  !d.IsDelete
                              select new GetDocsOutputModel(d.Id, d.DocType, d.Title, d.CreateBy,
                                  d.CreateAt, d.UpdateBy, d.UpdateAt)).ToList();

            resultList.ForEach(r =>
            {
                r.CreatorAvatarColor = _userService.GetCacheUserValue(r.CreateBy, UseInfoType.AvatarColor);
                r.CreatorAvatarText = _userService.GetCacheUserValue(r.CreateBy, UseInfoType.AvatarText);
                r.UpdatePersonAvatarColor = _userService.GetCacheUserValue(r.UpdateBy, UseInfoType.AvatarColor);
                r.UpdatePersonAvatarText = _userService.GetCacheUserValue(r.UpdateBy, UseInfoType.AvatarText);
            });

            return this.SuccessCommonResult(resultList);
        }

        [HttpPost]
        [ProducesResponseType(typeof(CommonResult<GetDocOutputModel>), 200)]
        public CommonResult GetDoc(GetDocInputModel model)
        {
            // 获取文档内容或历史版本内容
            var resultList = model.historyId == null ?
                (from d in _snippetDbContext.DocInfos.AsNoTracking()
                 where d.Id == model.id
                 select new GetDocOutputModel(d.Id, d.FolderId, d.DocType, d.Title, d.Content, d.CreateBy,
                     d.CreateAt, d.UpdateBy, d.UpdateAt)).ToList()
                                  :
                (from d in _snippetDbContext.DocInfos.AsNoTracking()
                 join h in _snippetDbContext.DocHistories.AsNoTracking() on d.Id equals h.DocInfoId
                 where d.Id == model.id && h.Id == model.historyId
                 select new GetDocOutputModel(d.Id, d.FolderId, d.DocType, h.Title, h.Content, d.CreateBy,
                     d.CreateAt, h.OperateBy, h.OperateAt)).ToList();
            if (resultList.Count() == 0)
            {
                return this.FailCommonResult(MessageConstant.DOC_ERROR_001);
            }

            var doc = resultList.First();
            doc.CreatorAvatarColor = _userService.GetCacheUserValue(doc.CreateBy, UseInfoType.AvatarColor);
            doc.CreatorAvatarText = _userService.GetCacheUserValue(doc.CreateBy, UseInfoType.AvatarText);
            doc.UpdatePersonAvatarColor = _userService.GetCacheUserValue(doc.UpdateBy, UseInfoType.AvatarColor);
            doc.UpdatePersonAvatarText = _userService.GetCacheUserValue(doc.UpdateBy, UseInfoType.AvatarText);

            // 查找所有修改该文档的用户,并取得头像信息
            var modifyUsers = (from h in _snippetDbContext.DocHistories
                               where h.DocInfoId == model.id
                               select h.OperateBy).Distinct().ToList();
            doc.DocModifyUsers = new List<DocModifyUser>();
            modifyUsers.ForEach(userName =>
            {
                doc.DocModifyUsers.Add(new DocModifyUser
                {
                    UserName = userName,
                    AvatarColor = _userService.GetCacheUserValue(userName, UseInfoType.AvatarColor),
                    AvatarText = _userService.GetCacheUserValue(userName, UseInfoType.AvatarText)
                });
            });

            return this.SuccessCommonResult(doc);
        }

        [HttpPost]
        public async Task<CommonResult> CreateDoc(CreateDocInputModel model)
        {
            var now = DateTime.Now;
            var userName = _userService.GetUserName();

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
                CreateBy = userName,
                IsDelete = false
            });
            await _snippetDbContext.SaveChangesAsync();

            // 保存文档历史
            await _snippetDbContext.DocHistories.AddAsync(new DocHistory
            {
                DocInfoId = entity.Entity.Id,
                Title = model.title,
                Content = model.content,
                OperateAt = now,
                OperateBy = userName,
            });
            await _snippetDbContext.SaveChangesAsync();

            // 提取文档中的本地文件名，并关联保存
            var fileList = new Regex(RegexConstant.GuidPattern).Matches(model.content).Select(m => m.Value);
            var storeList = _snippetDbContext.DocFiles.Where(d => d.DocInfoId == entity.Entity.Id)
                .Select(d => d.FileName);
            var newFileList = fileList.Except(storeList);
            foreach (var file in newFileList)
            {
                _snippetDbContext.DocFiles.Add(new DocFile
                {
                    DocInfoId = entity.Entity.Id,
                    FileName = file
                });
            }
            await _snippetDbContext.SaveChangesAsync();

            // 提交事务
            await trans.CommitAsync();
            return this.SuccessCommonResult(MessageConstant.DOC_INFO_001);
        }

        [HttpPost]
        public async Task<CommonResult> CopyDoc(CopyDocInputModel model)
        {
            var now = DateTime.Now;
            var userName = _userService.GetUserName();

            // 开启事务
            using var trans = await _snippetDbContext.Database.BeginTransactionAsync();

            var origionalDoc = _snippetDbContext.DocInfos.AsNoTrackingWithIdentityResolution()
                .FirstOrDefault(d => d.Id == model.docId);

            origionalDoc.Id = default(int);
            origionalDoc.SpaceId = model.spaceId;
            origionalDoc.FolderId = model.folderId;
            origionalDoc.Title = origionalDoc.Title + CommonConstant.CopyDocTitle;
            origionalDoc.CreateBy = userName;
            origionalDoc.CreateAt = now;
            origionalDoc.UpdateBy = null;
            origionalDoc.UpdateAt = null;

            // 保存文档信息
            var entity = await _snippetDbContext.DocInfos.AddAsync(origionalDoc);
            await _snippetDbContext.SaveChangesAsync();

            // 保存文档历史
            await _snippetDbContext.DocHistories.AddAsync(new DocHistory
            {
                DocInfoId = entity.Entity.Id,
                Title = origionalDoc.Title,
                Content = origionalDoc.Content,
                OperateAt = now,
                OperateBy = userName,
            });
            await _snippetDbContext.SaveChangesAsync();

            // 提取文档中的本地文件名，并关联保存
            var fileList = new Regex(RegexConstant.GuidPattern).Matches(origionalDoc.Content).Select(m => m.Value);
            foreach (var file in fileList)
            {
                _snippetDbContext.DocFiles.Add(new DocFile
                {
                    DocInfoId = entity.Entity.Id,
                    FileName = file
                });
            }
            await _snippetDbContext.SaveChangesAsync();

            // 提交事务
            await trans.CommitAsync();

            return this.SuccessCommonResult(MessageConstant.DOC_INFO_004);
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
                                 orderby h.OperateAt descending
                                 select h).First();

            // 如果上一次修改时间距现在超过10分钟后，或其他人修改此文档时则会生成新的历史记录
            if (latestHistory.OperateAt.AddMinutes(10) < now ||
                latestHistory.OperateBy != userName)
            {
                await _snippetDbContext.DocHistories.AddAsync(new DocHistory
                {
                    DocInfoId = doc.Id,
                    Title = model.title,
                    Content = model.content,
                    OperateAt = now,
                    OperateBy = userName
                });
            }

            // 提取文档中的本地文件名，并关联保存
            var fileList = new Regex(RegexConstant.GuidPattern).Matches(model.content).Select(m => m.Value);
            var storeList = _snippetDbContext.DocFiles.Where(d => d.DocInfoId == doc.Id)
                .Select(d => d.FileName);
            var newFileList = fileList.Except(storeList);
            foreach (var file in newFileList)
            {
                _snippetDbContext.DocFiles.Add(new DocFile
                {
                    DocInfoId = doc.Id,
                    FileName = file
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

        [HttpPost]
        [ProducesResponseType(typeof(CommonResult<PagedModel<GetDocHistoriesOutputModel>>), 200)]
        public CommonResult GetDocHistories(GetDocHistoriesInputModel model)
        {
            var query = from his in _snippetDbContext.DocHistories
                        where his.DocInfoId == model.docId
                        orderby his.OperateAt descending
                        select new GetDocHistoriesOutputModel(his.Id, his.OperateAt, his.OperateBy);

            var take = model.size;
            var skip = model.size * (model.page - 1);

            return this.SuccessCommonResult(new PagedModel<GetDocHistoriesOutputModel>
            {
                Total = query.Count(),
                PagedData = query.Skip(skip).Take(take)
            });
        }
    }
}