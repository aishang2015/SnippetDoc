import { Reducer } from "redux";
import { ClassifyAction } from "./classifyAction";
import { ClassifyState } from "./classifyState";


export const ClassifyReducer: Reducer<ClassifyState> = (state, action: ClassifyAction) => {

    if (state === undefined) {
        return {
            spaceId: null,
            classify: null,
            fileType: null,
            fileId: null
        };
    }

    switch (action.type) {
        case "CLASSIFY_CHANGE":
            return {
                spaceId: action.spaceId!,
                classify: action.classify!,
                fileType: action.fileType!,
                fileId: action.fileId!
            };
        default:
            return state;
    }
}