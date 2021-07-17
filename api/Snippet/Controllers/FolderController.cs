using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Snippet.Business.Services;
using Snippet.Constants;
using Snippet.Core.Data;
using Snippet.Entity;
using Snippet.Models;
using Snippet.Models.Folder;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Snippet.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FolderController : ControllerBase
    {
        private readonly SnippetDbContext _snippetDbContext;

        private readonly IUserService _userService;

        public FolderController(SnippetDbContext snippetDbContext, IUserService userService)
        {
            _snippetDbContext = snippetDbContext;
            _userService = userService;
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
            await _snippetDbContext.SaveChangesAsync();
            await trans.CommitAsync();
            return this.SuccessCommonResult(MessageConstant.FOLDER_INFO_0001);
        }

        [HttpPost]
        [ProducesResponseType(typeof(CommonResult<List<GetFolderTreeOutputModel>>), 200)]
        public CommonResult GetFolderTree(GetFolderTreeInputModel model)
        {
            var query = from folder in _snippetDbContext.DocFolders.AsNoTracking()
                        join folderTree in _snippetDbContext.DocFolderTrees.AsNoTracking().Where(ft => ft.Length == 1)
                            on folder.Id equals folderTree.Descendant into ftGroup
                        from folderTree in ftGroup.DefaultIfEmpty()
                        where folder.SpaceId == model.spaceId
                        select new GetFolderTreeOutputModel(folder.Id, folderTree.Ancestor, folder.Name);

            return this.SuccessCommonResult(query.ToList());
        }

        [HttpPost]
        [ProducesResponseType(typeof(CommonResult<GetFolderOutputModel>), 200)]
        public CommonResult GetFolder(GetFolderInputModel model)
        {
            var query = from folder in _snippetDbContext.DocFolders.AsNoTracking()
                        join folderTree in _snippetDbContext.DocFolderTrees.AsNoTracking().Where(ft => ft.Length == 1)
                            on folder.Id equals folderTree.Descendant into ftGroup
                        from folderTree in ftGroup.DefaultIfEmpty()
                        where folder.Id == model.folderId
                        select new GetFolderOutputModel(folderTree.Ancestor, folder.Name);

            return this.SuccessCommonResult(query.FirstOrDefault());
        }

        [HttpPost]
        public async Task<CommonResult> DeleteFolder(DeleteFolderInputModel model)
        {
            var folderTrees = (from f in _snippetDbContext.DocFolders
                               join ft in _snippetDbContext.DocFolderTrees
                                   on f.Id equals ft.Ancestor
                               where f.Id == model.folderId
                               select ft).Distinct().ToList();
            var folderIds = folderTrees.Select(ft => ft.Descendant).Distinct().ToList();
            var hasFile = (from d in _snippetDbContext.DocInfos
                           where folderIds.Contains(d.FolderId.Value) &&
                                 d.FolderId != null
                           select d.Id).Any();

            if (hasFile)
            {
                return this.FailCommonResult(MessageConstant.FOLDER_ERROR_0001);
            }

            // 删除文件夹
            var folders = (from f in _snippetDbContext.DocFolders
                           where folderIds.Contains(f.Id)
                           select f).ToList();
            _snippetDbContext.DocFolders.RemoveRange(folders);

            // 删除文件夹树
            _snippetDbContext.DocFolderTrees.RemoveRange(folderTrees);

            await _snippetDbContext.SaveChangesAsync();

            return this.SuccessCommonResult(MessageConstant.FOLDER_INFO_0002);
        }

        [HttpPost]
        public async Task<CommonResult> UpdateFolder(UpdateFolderInputModel model)
        {
            if (model.upFolderId == model.folderId)
            {
                return this.FailCommonResult(MessageConstant.FOLDER_ERROR_0002);
            }

            var folder = _snippetDbContext.DocFolders.Find(model.folderId);
            folder.Name = model.name;

            // 上级文件夹id
            int? upFolderId = (from ft in _snippetDbContext.DocFolderTrees
                               where ft.Length == 1 && ft.Descendant == model.folderId
                               select ft.Ancestor).FirstOrDefault();
            if (upFolderId != model.upFolderId)
            {
                //// 找到当前文件夹的祖先节点集合
                //var upFolderIds = from ft in _snippetDbContext.DocFolderTrees
                //                  where ft.Descendant == folder.Id && ft.Length > 0
                //                  select ft.Ancestor;

                //// 找到当前文件夹的后代节点集合
                //var subFolderIds = from ft in _snippetDbContext.DocFolderTrees
                //                   where ft.Ancestor == folder.Id
                //                   select ft.Descendant;

                // 找到上一步祖先节点和后代节点之间的所有关系
                var treeNodes = from ft in _snippetDbContext.DocFolderTrees
                                let upfolderIdQuery = (from ft1 in _snippetDbContext.DocFolderTrees
                                                       where ft1.Descendant == folder.Id && ft1.Length > 0
                                                       select ft1.Ancestor).ToList()
                                let subFolderIdQuery = (from ft2 in _snippetDbContext.DocFolderTrees
                                                        where ft2.Ancestor == folder.Id
                                                        select ft2.Descendant).ToList()
                                where upfolderIdQuery.Contains(ft.Ancestor) && subFolderIdQuery.Contains(ft.Descendant)
                                select ft;
                _snippetDbContext.RemoveRange(treeNodes);

                // 当前文件夹的子树
                var moveNodes = (from ft in _snippetDbContext.DocFolderTrees
                                 where ft.Ancestor == folder.Id
                                 select ft).ToList();

                // 找到新父节点的全部祖先
                var newParents = (from ft in _snippetDbContext.DocFolderTrees
                                  where ft.Descendant == model.upFolderId
                                  select ft).ToList();

                // 笛卡尔积构造新的上级树和子树的关系
                foreach (var parent in newParents)
                {
                    foreach (var node in moveNodes)
                    {
                        await _snippetDbContext.DocFolderTrees.AddAsync(new DocFolderTree
                        {
                            Ancestor = parent.Ancestor,
                            Descendant = node.Descendant,
                            Length = parent.Length + node.Length + 1
                        });
                    }
                }
            }

            await _snippetDbContext.SaveChangesAsync();
            return this.SuccessCommonResult(MessageConstant.FOLDER_INFO_0003);
        }
    }
}