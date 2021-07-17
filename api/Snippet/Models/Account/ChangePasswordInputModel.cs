using FluentValidation;
using Snippet.Constants;
using Snippet.Core;

namespace Snippet.Models.Account
{
    public record ChangePasswordInputModel(string oldPassword, string confirmPassword, string newPassword);

    public class ChangePasswordInputModelValidator : AbstractValidator<ChangePasswordInputModel>
    {
        public ChangePasswordInputModelValidator()
        {
            RuleFor(m => m.oldPassword).Equal(m => m.confirmPassword)
                .ConfirmMessage(MessageConstant.ACCOUNT_ERROR_0010);
        }
    }
}