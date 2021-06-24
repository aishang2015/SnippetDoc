using FluentValidation;
using Snippet.Constants;
using Snippet.Core;

namespace Snippet.Models.Account
{
    public record ThirdPartyLoginInputModel(string Code, string Source);

    public class ThirdPartyLoginInputModelValidator : AbstractValidator<ThirdPartyLoginInputModel>
    {
        public ThirdPartyLoginInputModelValidator()
        {
            RuleFor(x => x.Code).NotEmpty().ConfirmMessage(MessageConstant.ACCOUNT_ERROR_0002);
            RuleFor(x => x.Source).NotEmpty().ConfirmMessage(MessageConstant.ACCOUNT_ERROR_0003);
        }
    }
}