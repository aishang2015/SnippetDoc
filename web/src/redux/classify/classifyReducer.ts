import { Reducer } from "redux";
import { ClassifyAction } from "./classifyAction";
import { ClassifyState } from "./classifyState";


export const ClassifyReducer: Reducer<ClassifyState> = (state, action: ClassifyAction) => {

    if (state === undefined) {
        return {
            spaceId: null,
            classify: null
        };
    }

    switch (action.type) {
        case "CLASSIFY_CHANGE":
            return {
                spaceId: action.spaceId!,
                classify: action.classify!
            };
        default:
            return state;
    }
}