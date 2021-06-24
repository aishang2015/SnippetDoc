using FluentValidation;
using Snippet.Constants;
using Snippet.Core;

namespace Snippet.Models.User
{
    public record CreateUserInputModel(string userName, int role, bool isActive);

    public class CreateUserInputModelValidator : AbstractValidator<CreateUserInputModel>
    {
        public CreateUserInputModelValidator()
        {
            RuleFor(m => m.userName).NotEmpty().ConfirmMessage(MessageConstant.USER_ERROR_0002);
            RuleFor(m => m.userName).MaximumLength(20).ConfirmMessage(MessageConstant.USER_ERROR_0003);
            RuleFor(m => m.role).Must(v => v == 1 || v == 2).ConfirmMessage(MessageConstant.USER_ERROR_0004);
        }
    }
}