namespace Snippet.Models.Doc
{
    public record GetDocsInputModel(int page, int size, int spaceId, int? folderId, string name);
}