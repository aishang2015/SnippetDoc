namespace Snippet.Models.Doc
{
    public record UpdateFolderInputModel(int spaceId, int folderId, string name, int? upFolderId);
}