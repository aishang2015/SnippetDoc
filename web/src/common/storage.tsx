export class StorageService {

    //#region 第三方登录授权信息

    static clearOauthStore(): void {
        localStorage.removeItem("snippet-third-username");
        localStorage.removeItem("snippet-third-type");
        localStorage.removeItem("snippet-third-cachekey");
    }

    static setOauthStore(thirdPartyUserName: string, thirdPartyType: string, thirdPartyInfoCacheKey: string): void {
        localStorage.setItem("snippet-third-username", thirdPartyUserName);
        localStorage.setItem("snippet-third-type", thirdPartyType);
        localStorage.setItem("snippet-third-cachekey", thirdPartyInfoCacheKey);
    }

    static getThirdPartyUserName = () => localStorage.getItem("snippet-third-username");
    static getThirdPartyType = () => localStorage.getItem("snippet-third-type");
    static getThirdPartyInfoCacheKey = () => localStorage.getItem("snippet-third-cachekey");

    //#endregion

    //#region 用户登录信息

    static clearLoginStore(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("user-name");
        localStorage.removeItem("expire");
    }

    static setLoginStore(accessToken: string, userName: string, expire: string): void {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user-name', userName);
        localStorage.setItem("expire", expire);
    }

    static getAccessToken = () => localStorage.getItem("token");
    static getUserName = () => localStorage.getItem("user-name");
    static getExpire = () => localStorage.getItem("expire");

    //#endregion
}