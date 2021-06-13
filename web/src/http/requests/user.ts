import { CommonResult } from "../common-result";
import { Axios } from "../request";



export class UserRequests {

    public static searchUserByName(model: searchUserByNameModel) {
        return Axios.instance.post<CommonResult<searchUserByNameResult[]>>('api/user/searchUserByName', model);
    }
}

export interface searchUserByNameModel {
    name: string;
}

export interface searchUserByNameResult {
    userId: number;
    userName: number;
}