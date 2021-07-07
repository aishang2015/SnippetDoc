import { combineReducers, createStore } from "redux";
import { CounterReducer } from "./counter/counterReducer";
import { NavCollapsedReducer } from "./navCollapsed/navCollapsedReducer";
import { NotificationReducer } from "./notification/notificationReducer";
import { ClassifyReducer } from "./classify/classifyReducer";
import { TargetFileReducer } from "./targetFile/targetFileReducer";

export class ReduxStore {

    static initReduxStore() {
        const reducer = combineReducers({
            CounterReducer,
            NavCollapsedReducer,
            NotificationReducer,
            ClassifyReducer,
            TargetFileReducer
        });

        return createStore(reducer);
    }
}