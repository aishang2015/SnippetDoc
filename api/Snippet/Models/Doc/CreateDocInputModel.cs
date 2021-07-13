namespace Snippet.Models.Doc
{
    public record CreateDocInputModel(int spaceId, int? folderId, string title, string content);
}