import { Constants } from "./constant";


export class RightUtil {

    static IsSystemManage(): boolean {
        return localStorage.getItem('user-role') === Constants.SystemRoleDic[1];
    }
}