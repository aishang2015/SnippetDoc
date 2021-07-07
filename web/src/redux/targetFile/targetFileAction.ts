export interface TargetFileChangeAction {
    type: "TARGETFILE_CHANGE",
    fileType?: number | null,
    fileId?: number | null
}

export type TargetFileAction = TargetFileChangeAction;