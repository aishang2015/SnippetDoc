import { CommonResult, EmptyCommonResult } from "../common-result";
import { Axios } from "../request";



export class FolderRequests {

    public static createFolder(model: CreateFolderRequest) {
        return Axios.instance.post<EmptyCommonResult>('api/folder/createFolder', model);
    }

    public static getFolderTree(model: getFolderTreeRequest) {
        return Axios.instance.post<CommonResult<getFolderTreeResponse[]>>('api/folder/getFolderTree', model);
    }

    public static getFolder(model: getFolderRequest) {
        return Axios.instance.post<CommonResult<getFolderResponse>>('api/folder/getFolder', model);
    }

    public static deleteFolder(model: deleteFolderRequest) {
        return Axios.instance.post<EmptyCommonResult>('api/folder/deleteFolder', model);
    }

    public static updateFolder(model: updateFolderRequest) {
        return Axios.instance.post<EmptyCommonResult>('api/folder/updateFolder', model);
    }
}

export interface CreateFolderRequest {
    spaceId: number,
    name: string,
    upFolderId: number
}

export interface getFolderTreeRequest {
    spaceId: number
}

export interface deleteFolderRequest {
    spaceId: number,
    folderId: number
}

export interface updateFolderRequest {
    spaceId: number,
    folderId: number,
    name: string,
    upFolderId: number
}

export interface getFolderTreeResponse {
    id: number,
    upId: number | null,
    name: string
}

export interface getFolderRequest {
    folderId: number
}

export interface getFolderResponse {
    upId: number,
    name: string
}