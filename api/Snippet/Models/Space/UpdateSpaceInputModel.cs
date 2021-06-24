using FluentValidation;
using Snippet.Constants;
using Snippet.Core;

namespace Snippet.Models.Space
{
    public record UpdateSpaceInputModel(int id, string Name);

    public class UpdateSpaceInputModelValidator : AbstractValidator<UpdateSpaceInputModel>
    {
        public UpdateSpaceInputModelValidator()
        {
            RuleFor(m => m.Name).NotEmpty().ConfirmMessage(MessageConstant.SPACE_ERROR_0003);
            RuleFor(m => m.Name).MaximumLength(40).ConfirmMessage(MessageConstant.SPACE_ERROR_0004);
        }
    }
}