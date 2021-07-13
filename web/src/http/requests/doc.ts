

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
}

export interface getDocsRequest {
    spaceId: number,
    folderId: number | null
}

export interface getDocsResponse {
    id: number,
    title: string,
    createBy: string,
    createAt: Date,
    updateBy: string,
    updateAt: Date
}

export interface getDocRequest {
    id: number,
    historyId: number | null
}

export interface getDocContent {
    id: number,
    folderId: number,
    title: string,
    content: string,
    createBy: string,
    createAt: Date,
    updateBy: string,
    updateAt: Date
}

export interface createDocRequest {
    spaceId: number,
    folderId: number,
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

