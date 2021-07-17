

import { CommonResult, EmptyCommonResult } from "../common-result";
import { Axios } from "../request";

export class DocRequests {

    public static getDocs(model: getDocsRequest) {
        return Axios.instance.post<CommonResult<getDocsResponse[]>>('api/doc/getDocs', model);
    }

    public static getDoc(model: getDocRequest) {
        return Axios.instance.post<CommonResult<getDocContent>>('api/doc/getDoc', model);
    }

    public static createDoc(model: createDocRequest) {
        return Axios.instance.post<EmptyCommonResult>('api/doc/createDoc', model);
    }

    public static updateDoc(model: updateDocRequest) {
        return Axios.instance.post<EmptyCommonResult>('api/doc/updateDoc', model);
    }

    public static deleteDoc(model: deleteDocRequest) {
        return Axios.instance.post<EmptyCommonResult>('api/doc/deleteDoc', model);
    }

    public static getDocHistories(model: getDocHistoriesRequest) {
        return Axios.instance.post<CommonResult<getDocHistoriesResponse>>('api/doc/getDocHistories', model);
    }
}

export interface getDocsRequest {
    spaceId: number,
    folderId: number | null
}

export interface getDocsResponse {
    id: number,
    docType: number,
    title: string,
    createBy: string,
    createAt: Date,
    updateBy: string,
    updateAt: Date,    
    creatorAvatarColor: string,
    creatorAvatarText: string,
    updatePersonAvatarColor: string,
    updatePersonAvatarText: string
}

export interface getDocRequest {
    id: number,
    historyId: number | null
}

export interface getDocContent {
    id: number,
    folderId: number,
    docType: number,
    title: string,
    content: string,
    createBy: string,
    createAt: Date,
    updateBy: string,
    updateAt: Date,
    creatorAvatarColor: string,
    creatorAvatarText: string,
    updatePersonAvatarColor: string,
    updatePersonAvatarText: string,
    docModifyUsers: [
      {
        userName: string,
        avatarColor: string,
        avatarText: string
      }
    ]
}

export interface createDocRequest {
    spaceId: number,
    folderId: number,
    docType: number,
    title: string,
    content: string
}

export interface updateDocRequest {
    id: number,
    title: string,
    content: string
}

export interface deleteDocRequest {
    id: number
}

export interface getDocHistoriesRequest {
    page: number,
    size: number,
    docId: number
}

export interface getDocHistoriesResponse {
    total: number,
    pagedData: [
        {
            id: number,
            operateAt: Date,
            operateBy: string
        }
    ]
}
