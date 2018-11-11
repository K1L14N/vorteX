import { createStore as _createStore } from "redux";

import _reducer from "./reducers";
import _enhancer from "./enhancers";
import { sagaMiddleware } from "./enhancers/middlewares";
import mySaga from "./enhancers/middlewares/saga";

export default (
    reducer = _reducer,
    preloadedState = undefined,
    enhancer = _enhancer
) => {
    const store = _createStore(reducer, preloadedState, enhancer);
    sagaMiddleware.run(mySaga);
    return store;
};
