import { combineReducers } from "redux";
import { authReducer } from "./AuthReducers";
import { NotificationReducer } from "./NotificationReducers";
import { SourcesReducer } from "./SourcesReducers";

const rootReducer = combineReducers({
    auth: authReducer,
    notification: NotificationReducer,
    sources:SourcesReducer,
});

export default rootReducer;