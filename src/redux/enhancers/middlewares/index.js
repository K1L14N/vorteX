import { applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import router from "./router";

export const sagaMiddleware = createSagaMiddleware();

const middlewares = [
    router,
    sagaMiddleware
    // other middlewares go here
];
export default applyMiddleware(...middlewares);
