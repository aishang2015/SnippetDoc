import { CommonResult, EmptyCommonResult } from "../common-result";
import { Axios } from "../request";

export class RecycleRequests {

    public static getDeletedDocs(model: getDeletedDocsRequest) {
        return Axios.instance.post<CommonResult<getDeletedDocsResponse>>('api/recycle/getDeletedDocs', model);
    }

    public static revertDeleteDoc(model: revertDeleteDocRequest) {
        return Axios.instance.post<EmptyCommonResult>('api/recycle/revertDeleteDoc', model);
    }

    public static physicsDeleteDoc(model: physicsDeleteDocRequest) {
        return Axios.instance.post<EmptyCommonResult>('api/recycle/physicsDeleteDoc', model);
    }
}

export interface revertDeleteDocRequest {
    id: number
}

export interface physicsDeleteDocRequest {
    id: number
}

export interface getDeletedDocsRequest {
    page: number,
    size: number,
    spaceId: number
}

export interface getDeletedDocsResponse {
    total: number,
    pagedData: [{
        id: number,
        docType: number,
        spaceName: string,
        title: string,
        content: string,
        createBy: string,
        createAt: Date,
        updateBy: string,
        updateAt: Date
    }]
}