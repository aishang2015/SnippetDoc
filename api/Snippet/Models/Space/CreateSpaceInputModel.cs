using FluentValidation;
using Snippet.Constants;
using Snippet.Core;

namespace Snippet.Models.Space
{
    public record CreateSpaceInputModel(string Name);

    public class CreateSpaceInputModelValidator : AbstractValidator<CreateSpaceInputModel>
    {
        public CreateSpaceInputModelValidator()
        {
            RuleFor(m => m.Name).NotEmpty().ConfirmMessage(MessageConstant.SPACE_ERROR_0003);
            RuleFor(m => m.Name).MaximumLength(50).ConfirmMessage(MessageConstant.SPACE_ERROR_0004);
        }
    }

}
