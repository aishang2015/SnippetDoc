export interface ClassifyChangeAction {
    type: "CLASSIFY_CHANGE",
    spaceId?: number | null,
    classify?: number | null,
    folderId?: number | null
}

export type ClassifyAction = ClassifyChangeAction;