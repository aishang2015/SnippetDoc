import { ClassifyChangeAction } from "./classifyAction";

export const onClassifyChange = (spaceId: number, classify: number, fileType: number, fileId: number): ClassifyChangeAction => ({
    type: "CLASSIFY_CHANGE",
    spaceId: spaceId,
    classify: classify,
    fileType: fileType,
    fileId: fileId
});