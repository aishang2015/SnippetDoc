using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Snippet.Business.Services;
using Snippet.Core;
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
        public CommonResult GetDocs(GetDocsInputModel model)
        {
            var query = from d in _snippetDbContext.DocInfos
                        where d.SpaceId == model.spaceId &&
                            d.FolderId == model.folderId &&
                            !d.IsDelete
                        select new GetDocsOutputModel(d.Id, d.Name, d.Content, d.CreateBy,
                            d.CreateAt, d.UpdateBy, d.UpdateAt);

            query.AndIfExist(model.name, d => d.Name.Contains(model.name));

            var result = new PagedModel<GetDocsOutputModel>
            {
                Total = query.Count(),
                Data = query.Skip(model.size * (model.page - 1)).Take(model.page)
            };
            return this.SuccessCommonResult(result);
        }

        [HttpPost]
        public async Task<CommonResult> CreateDoc(CreateDocInputModel model)
        {
            var now = DateTime.Now;

            // 保存文档信息
            using var trans = await _snippetDbContext.Database.BeginTransactionAsync();
            var entity = await _snippetDbContext.DocInfos.AddAsync(new DocInfo
            {
                SpaceId = model.spaceId,
                FolderId = model.folderId,
                Name = model.name,
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
                Name = model.name,
                Content = model.content,
                RecordAt = now
            });

            // 提交事务
            await trans.CommitAsync();
            return this.SuccessCommonResult();
        }

        [HttpPost]
        public async Task<CommonResult> UpdateDoc(UpdateDocInputModel model)
        {
            var userName = _userService.GetUserName();
            var now = DateTime.Now;

            // 更新内容
            var doc = _snippetDbContext.DocInfos.Find(model.id);
            doc.Name = model.name;
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
                    Name = model.name,
                    Content = model.content,
                    RecordAt = now
                });
            }

            await _snippetDbContext.SaveChangesAsync();

            return this.SuccessCommonResult();
        }

        [HttpPost]
        public async Task<CommonResult> DeleteDoc(DeleteDocInputModel model)
        {
            var doc = _snippetDbContext.DocInfos.Find(model.id);
            doc.IsDelete = true;
            await _snippetDbContext.SaveChangesAsync();
            return this.SuccessCommonResult();
        }

        [HttpPost]
        public async Task<CommonResult> RevertDeleteDoc(RevertDeleteDocInputModel model)
        {
            var doc = _snippetDbContext.DocInfos.Find(model.id);
            doc.IsDelete = false;
            await _snippetDbContext.SaveChangesAsync();
            return this.SuccessCommonResult();
        }

        [HttpPost]
        public async Task<CommonResult> PhysicsDeleteDoc(PhysicsDeleteDocInputModel model)
        {
            var doc = _snippetDbContext.DocInfos.Find(model.id);
            _snippetDbContext.DocInfos.Remove(doc);

            var docHistories = _snippetDbContext.DocHistories.Where(dh => dh.DocInfoId == model.id);
            _snippetDbContext.DocHistories.RemoveRange(docHistories);

            await _snippetDbContext.SaveChangesAsync();
            return this.SuccessCommonResult();
        }

        [HttpPost]
        public async Task<CommonResult> CreateFolder(CreateFolderInputModel model)
        {
            using var trans = await _snippetDbContext.Database.BeginTransactionAsync();

            // 创建文件夹信息
            var entity = await _snippetDbContext.DocFolders.AddAsync(new DocFolder
            {
                SpaceId = model.spaceId,
                Name = model.name
            });
            await _snippetDbContext.SaveChangesAsync();

            // 根据父节点创建树信息
            if (model.upFolderId != null)
            {
                var trees = _snippetDbContext.DocFolderTrees
                    .Where(t => t.Descendant == model.upFolderId.Value);

                foreach (var tree in trees)
                {
                    await _snippetDbContext.DocFolderTrees.AddAsync(new DocFolderTree
                    {
                        Ancestor = tree.Ancestor,
                        Descendant = entity.Entity.Id,
                        Length = tree.Length + 1
                    });
                }
            }

            // 添加树关系自身节点
            await _snippetDbContext.DocFolderTrees.AddAsync(new DocFolderTree
            {
                Ancestor = entity.Entity.Id,
                Descendant = entity.Entity.Id,
                Length = 0
            });
            await trans.CommitAsync();
            return this.SuccessCommonResult();
        }

        [HttpPost]
        public CommonResult GetFolderTree(GetFolderTreeInputModel model)
        {
            var query = from folder in _snippetDbContext.DocFolders
                        join folderTree in _snippetDbContext.DocFolderTrees
                            on folder.Id equals folderTree.Descendant into ftGroup
                        from folderTree in ftGroup.DefaultIfEmpty()
                        where folderTree.Length == 1
                        select new GetFolderTreeOutputModel(folder.Id, folderTree.Ancestor, folder.Name);

            return this.SuccessCommonResult(query.ToList());
        }

    }
}
