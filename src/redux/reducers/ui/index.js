import { combineReducers } from "redux";

import sidebar from "./sidebar";
import metamask from "./metamask";

export default combineReducers({
    sidebar,
    metamask
    // other ui reducers go here
});
