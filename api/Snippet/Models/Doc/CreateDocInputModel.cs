namespace Snippet.Models.Doc
{
    public record CreateDocInputModel(int spaceId, int? folderId, int DocType, string title, string content);
}