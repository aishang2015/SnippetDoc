import { ClassifyChangeAction } from "./classifyAction";

export const onClassifyChange = (spaceId: number, classify: number): ClassifyChangeAction => ({
    type: "CLASSIFY_CHANGE",
    spaceId: spaceId,
    classify: classify
});