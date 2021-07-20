import { GetEditDocInfoAction } from "./editDocAction";

export const onGetEditDocInfo = (msg: any): GetEditDocInfoAction => ({ type: "GET_EDITDOC_INFO", message: msg });