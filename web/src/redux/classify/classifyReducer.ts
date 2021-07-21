import { Reducer } from "redux";
import { ClassifyAction } from "./classifyAction";
import { ClassifyState } from "./classifyState";


export const ClassifyReducer: Reducer<ClassifyState> = (state, action: ClassifyAction) => {

    if (state === undefined) {
        return {
            spaceId: null,
            spaceRole: null,
            classify: null,
            folderId: null
        };
    }

    switch (action.type) {
        case "CLASSIFY_CHANGE":
            return {
                spaceId: action.spaceId!,
                spaceRole: action.spaceRole!,
                classify: action.classify!,
                folderId: action.folderId!
            };
        default:
            return state;
    }
}