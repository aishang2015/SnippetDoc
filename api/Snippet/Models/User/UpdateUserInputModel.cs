using FluentValidation;
using Snippet.Constants;
using Snippet.Core;

namespace Snippet.Models.User
{
    public record UpdateUserInputModel(int userId, string userName, int role, bool isActive);

    public class UpdateUserInputModelValidator : AbstractValidator<UpdateUserInputModel>
    {
        public UpdateUserInputModelValidator()
        {
            RuleFor(m => m.userName).NotEmpty().ConfirmMessage(MessageConstant.USER_ERROR_0002);
            RuleFor(m => m.userName).MaximumLength(20).ConfirmMessage(MessageConstant.USER_ERROR_0003);
            RuleFor(m => m.role).Must(v => v == 1 || v == 2).ConfirmMessage(MessageConstant.USER_ERROR_0004);
        }
    }
}