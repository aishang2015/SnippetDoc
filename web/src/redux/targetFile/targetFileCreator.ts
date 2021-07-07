import { TargetFileChangeAction } from "./targetFileAction";

export const onTargetFileChange = (fileType: number, fileId: number): TargetFileChangeAction => ({
    type: "TARGETFILE_CHANGE",
    fileType: fileType,
    fileId: fileId
});