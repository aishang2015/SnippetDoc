import { ClassifyChangeAction } from "./classifyAction";

export const onClassifyChange = (spaceId: number, spaceRole: number, classify: number, folderId: number): ClassifyChangeAction => ({
    type: "CLASSIFY_CHANGE",
    spaceId: spaceId,
    spaceRole: spaceRole,
    classify: classify,
    folderId: folderId
});