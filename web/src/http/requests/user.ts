import { CommonResult, EmptyCommonResult } from "../common-result";
import { Axios } from "../request";



export class UserRequests {

    public static searchUserByName(model: { name: string }) {
        let result: {
            userId: number;
            userName: number;
        }
        return Axios.instance.post<CommonResult<typeof result[]>>('api/user/searchUserByName', model);
    }

    public static getUserList(model: { page: number, size: number }) {
        let result: {
            total: number,
            pagedData: [
                {
                    id: number,
                    userName: string,
                    roleId: number,
                    role: string,
                    isActive: boolean
                }
            ]
        };
        return Axios.instance.post<CommonResult<typeof result>>('api/user/getUserList', model);
    }

    public static createUser(model: { userName: string, role: number, isActive: boolean }) {
        return Axios.instance.post<EmptyCommonResult>('api/user/createUser', model);
    }

    public static updateUser(model: { userId: number, userName: string, role: number, isActive: boolean }) {
        return Axios.instance.post<EmptyCommonResult>('api/user/updateUser', model);
    }

    public static deleteUser(model: { userId: number }) {
        return Axios.instance.post<EmptyCommonResult>('api/user/deleteUser', model);
    }

    public static setPassword(model: { userId: number, password: string }) {
        return Axios.instance.post<EmptyCommonResult>('api/user/setPassword', model);
    }
}
