namespace Snippet.Models.Doc
{
    public record CreateFolderInputModel(int spaceId, string name, int? upFolderId);
}