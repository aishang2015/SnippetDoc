using Snippet.Core.Data;
using System.Linq;

namespace Snippet.Business.Services
{
    public interface ISpaceRightService
    {
        public bool CanManageSpace(int spaceId);

        public bool CanEditSpace(int spaceId);
    }

    public class SpaceRightService : ISpaceRightService
    {
        private readonly SnippetDbContext _snippetDbContext;

        private readonly IUserService _userService;

        public SpaceRightService(
            SnippetDbContext snippetDbContext,
            IUserService userService)
        {
            _snippetDbContext = snippetDbContext;
            _userService = userService;
        }

        public bool CanManageSpace(int spaceId)
        {
            return _snippetDbContext.SpaceMembers.Any(sm =>
                    sm.SpaceId == spaceId &&
                    sm.MemberName == _userService.GetUserName() &&
                    sm.MemberRole == 1);
        }

        public bool CanEditSpace(int spaceId)
        {
            return _snippetDbContext.SpaceMembers.Any(sm =>
                    sm.SpaceId == spaceId &&
                    sm.MemberName == _userService.GetUserName() &&
                    (sm.MemberRole == 0 || sm.MemberRole == 1 || sm.MemberRole == 2));
        }
    }
}