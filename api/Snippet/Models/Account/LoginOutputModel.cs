using System;

namespace Snippet.Models.Account
{
    public record LoginOutputModel(string AccessToken, string UserName, DateTime Expire);
}