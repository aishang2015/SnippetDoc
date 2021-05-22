using AutoMapper;
using Snippet.Entity;
using Snippet.Models.Account;

namespace Snippet.Models
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<SnippetUser, UserInfoOutputModel>().ReverseMap();
        }
    }
}
