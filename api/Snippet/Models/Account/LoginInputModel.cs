using FluentValidation;
using Snippet.Constants;
using Snippet.Core;

namespace Snippet.Models.Account
{
    public record LoginInputModel(string UserName, string Password);

    public class LoginInputModelValidator : AbstractValidator<LoginInputModel>
    {
        public LoginInputModelValidator()
        {
            RuleFor(x => x.UserName).NotEmpty().ConfirmMessage(MessageConstant.ACCOUNT_ERROR_0002);
            RuleFor(x => x.Password).NotEmpty().ConfirmMessage(MessageConstant.ACCOUNT_ERROR_0003);
        }
    }
}