namespace Snippet.Models.Account
{
    public record ChangePasswordInputModel(string oldPassword, string confirmPassword, string newPassword);
}
