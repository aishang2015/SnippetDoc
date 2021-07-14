namespace Snippet.Models.Folder
{
    public record UpdateFolderInputModel(int spaceId, int folderId, string name, int? upFolderId);
}