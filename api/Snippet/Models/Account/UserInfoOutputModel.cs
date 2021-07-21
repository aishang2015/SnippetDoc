namespace Snippet.Models.Account
{
    public record UserInfoOutputModel(int Id, string UserName, string Email, string PhoneNumber,
        string avatarColor, string avatarText)
    {
        public string SystemRole { get; set; }
    }
}