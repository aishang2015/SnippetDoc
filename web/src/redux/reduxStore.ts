import { combineReducers, createStore } from "redux";
import { CounterReducer } from "./counter/counterReducer";
import { NavCollapsedReducer } from "./navCollapsed/navCollapsedReducer";
import { NotificationReducer } from "./notification/notificationReducer";
import { ClassifyReducer } from "./classify/classifyReducer";
import { EditDocReducer } from "./editDoc/editDocReducer";

export class ReduxStore {

    static initReduxStore() {
        const reducer = combineReducers({
            CounterReducer,
            EditDocReducer,
            NavCollapsedReducer,
            NotificationReducer,
            ClassifyReducer
        });

        return createStore(reducer);
    }
}