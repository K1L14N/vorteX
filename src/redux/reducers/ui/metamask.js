import { ROPSTEN_CONNECT, ROPSTEN_DISCONNECT } from "../../actions/ui";

const initialState = {
    onRopsten: true //TODO: fetching window.web3 ...
};

export default (state = initialState, { type }) => {
    switch (type) {
        case ROPSTEN_CONNECT:
            return {
                ...state,
                onRopsten: true
            };
        case ROPSTEN_DISCONNECT:
            return {
                ...state,
                onRopsten: false
            };
        default:
            return state;
    }
};
