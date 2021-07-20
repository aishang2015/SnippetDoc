import { Reducer } from "redux";
import { EditDocAction } from "./editDocAction";
import { EditDocState } from "./editDocState";

export const EditDocReducer: Reducer<EditDocState> = (state, action: EditDocAction) => {

    if (state === undefined) {
        return { editDoc: {} };
    }

    switch (action.type) {
        case "GET_EDITDOC_INFO":
            return { editDoc: (action as EditDocAction).message! };
        default:
            return state;
    }
}