using System;

namespace Snippet.Models.Doc
{
    public record GetDocHistoriesOutputModel(int id, DateTime operateAt, string operateBy);
}