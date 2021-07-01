import { CommonResult, EmptyCommonResult } from "../common-result";
import { Axios } from "../request";

export function login(model: LoginModel) {
    return Axios.instance.post<CommonResult<LoginResult>>('api/account/login', model);
}

export function getUserInfo() {
    return Axios.instance.post<CommonResult<UserInfoResult>>('api/account/getCurrentUserInfo', null);
}

export function updateUserAvatar(model: UserAvatarInfo) {
    return Axios.instance.post<EmptyCommonResult>('api/account/updateUserAvatar', model);
}

export function changePassword(model: ChangePwdModel) {
    return Axios.instance.post<EmptyCommonResult>('api/account/changePassword', model);
}

export function handleThirdPartyCode(code: string, source: string) {
    return Axios.instance.post<CommonResult<ThirdPartyLoginResult>>(`/api/account/ThirdPartyLogin`, {
        code: code,
        source: source
    });
}

export function bindingThirdPartyAccount(model: BindingModel) {
    return Axios.instance.post<CommonResult<LoginResult>>('api/account/BindingThirdPartyAccount', model);
}

export interface LoginModel {
    userName: string;
    password: string;
}

export interface LoginResult {
    accessToken: string;
    userName: string;
    expire: Date;
}

export interface UserInfoResult {
    id: number;
    userName: string;
    email: string;
    phoneNumber: string;
    avatarColor: string;
    avatarText: string;
}

export interface UserAvatarInfo {
    avatarColor: string,
    avatarText: string
}

export interface ChangePwdModel {
    oldPassword: string,
    confirmPassword: string,
    newPassword: string
}

export interface ThirdPartyLoginResult {
    accessToken: string;
    userName: string;
    thirdPartyType: string;
    thirdPartyUserName: string;
    thirdPartyInfoCacheKey: string;
}

export interface BindingModel {
    userName: string;
    password: string;
    thirdPartyType: string;
    thirdPartyInfoCacheKey: string;
}