﻿using Refit;
using Snippet.Core.Oauth.Models;
using System.Threading.Tasks;

namespace Snippet.Core.Oauth.Apis
{
    [Headers("User-Agent:Refit", "Accept:application/json")]
    public interface IGithubAuthApi
    {
        [Post("/login/oauth/access_token?client_id={appId}&client_secret={appSecret}&code={code}")]
        Task<GithubAccessTokenResponse> GetAccessTokenAsync(string appId, string appSecret, string code);
    }

    [Headers("User-Agent:Refit", "Accept:application/json")]
    public interface IGithubApi
    {
        [Get("/user")]
        Task<GithubUserInfo> GetUserAsync([Header("Authorization")] string authorization);
    }
}