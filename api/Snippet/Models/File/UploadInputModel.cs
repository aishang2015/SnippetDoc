using FluentValidation;
using Microsoft.AspNetCore.Http;
using Snippet.Constants;
using Snippet.Core;

namespace Snippet.Models.File
{
    public record UploadInputModel(IFormFile File);

    public class UploadInputModelValidator : AbstractValidator<UploadInputModel>
    {
        public UploadInputModelValidator()
        {
            RuleFor(x => x.File).NotNull().ConfirmMessage(MessageConstant.FILE_ERROR_0001);
        }
    }
}