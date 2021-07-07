import { Reducer } from "redux";
import { TargetFileAction } from "./targetFileAction";
import { TargetFileState } from "./targetFileState";


export const TargetFileReducer: Reducer<TargetFileState> = (state, action: TargetFileAction) => {

    if (state === undefined) {
        return {
            fileType: null,
            fileId: null
        }
    }

    switch (action.type) {
        case "TARGETFILE_CHANGE":
            return {
                fileType: action.fileType!,
                fileId: action.fileId!
            };
        default:
            return state;
    }
}