namespace Snippet.Models.Folder
{
    public record CreateFolderInputModel(int spaceId, string name, int? upFolderId);
}