export interface GetEditDocInfoAction {
    type: "GET_EDITDOC_INFO",
    message?: { [key: number]: string }
}
export type EditDocAction = GetEditDocInfoAction;