import { CommonResult, EmptyCommonResult } from "../common-result";
import { Axios } from "../request";


export class SpaceRequests {

    public static createSpace(model: CreateSpaceModel) {
        return Axios.instance.post<EmptyCommonResult>('api/space/createSpace', model);
    }

    public static updateSpace(model: UpdateSpaceModel) {
        return Axios.instance.post<EmptyCommonResult>('api/space/updateSpace', model);
    }

    public static deleteSpace(model: DeleteSpaceModel) {
        return Axios.instance.post<EmptyCommonResult>('api/space/deleteSpace', model);
    }

    public static getUserSpaceList() {
        return Axios.instance.post<CommonResult<GetUserSpaceListResult>>('api/space/getUserSpaceList', null);
    }

    public static getManageSpaceList() {
        return Axios.instance.post<CommonResult<GetManageSpaceListResult[]>>('api/space/getManageSpaceList', null);
    }

    public static getSpaceMemberList(model: GetSpaceMemberListModel) {
        return Axios.instance.post<CommonResult<GetSpaceMemberResult>>('api/space/getSpaceMemberList', model);
    }

    public static addSpaceMember(model: AddSpaceMemberModel) {
        return Axios.instance.post<EmptyCommonResult>('api/space/addSpaceMember', model);
    }

    public static removeSpaceMember(model: RemoveSpaceMemberModel) {
        return Axios.instance.post<EmptyCommonResult>('api/space/removeSpaceMember', model);
    }
}

export interface CreateSpaceModel {
    name: string;
}

export interface UpdateSpaceModel {
    id: number;
    name: string;
}

export interface DeleteSpaceModel {
    id: number;
}

export interface GetUserSpaceListResult {
    id: number;
    name: string;
    role: number;
}

export interface GetManageSpaceListResult {
    id: number;
    name: string;
    memberCount: number;
}

export interface GetSpaceMemberListModel {
    page: number;
    size: number;
    spaceId: number;
}

export interface GetSpaceMemberResult {
    memberName: string;
    memberRole: number;
}

export interface AddSpaceMemberModel {
    spaceId: number;
    userName: string;
    role: number;
}

export interface RemoveSpaceMemberModel {
    spaceId: number;
    userName: string;
}