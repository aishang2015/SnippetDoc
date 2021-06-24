namespace Snippet.Models.User
{
    public record GetUserListOutputModel(int id, string userName, int roleId, string role, bool isActive);
}