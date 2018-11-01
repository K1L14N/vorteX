import { combineReducers } from "redux";

import sidebar from "./sidebar";
import game from "./game";

export default combineReducers({
    sidebar,
    // other ui reducers go here
    game
});
