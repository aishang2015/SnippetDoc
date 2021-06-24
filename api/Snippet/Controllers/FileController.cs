using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Snippet.Core.Data;
using Snippet.Models;
using Snippet.Models.File;
using System;
using System.IO;
using System.Linq;

namespace Snippet.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class FileController : ControllerBase
    {
        private readonly SnippetDbContext _snippetDbContext;

        private readonly IWebHostEnvironment _webHostEnvironment;

        public FileController(SnippetDbContext snippetDbContext,
            IWebHostEnvironment webHostEnvironment)
        {
            _snippetDbContext = snippetDbContext;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost]
        public CommonResult UploadFile([FromForm] UploadInputModel model)
        {
            var distFolder = Path.Combine(_webHostEnvironment.ContentRootPath, "FileStore");
            if (!Directory.Exists(distFolder))
            {
                Directory.CreateDirectory(distFolder);
            }

            var newFileName = Guid.NewGuid().ToString("N") + "." + model.File.FileName.Split('.').Last();
            var distFile = Path.Combine(distFolder, newFileName);
            using var outputStream = System.IO.File.Create(distFile);
            using var inputStream = model.File.OpenReadStream();
            inputStream.CopyTo(outputStream);
            outputStream.Flush();

            return this.SuccessCommonResult(new UploadOutputModel(newFileName));
        }
    }
}