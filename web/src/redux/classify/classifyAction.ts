export interface ClassifyChangeAction {
    type: "CLASSIFY_CHANGE",
    spaceId?: number | null,
    classify?: number | null,
    fileType?: number | null,
    fileId?: number | null
}

export type ClassifyAction = ClassifyChangeAction;