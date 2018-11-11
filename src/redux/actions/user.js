export const GET_USER = "GET_USER";
export const START_PLAYING = "START_PLAYING";
export const SET_USER = "SET_USER";
export const START_LOADING_USER = "START_LOADING_USER";
export const END_LOADING_USER = "END_LOADING_USER";
export const START_TRANSACTION = "START_TRANSACTION";
export const END_TRANSACTION = "END_TRANSACTION";
export const REQUEST_MOVE = "REQUEST_MOVE";
export const SET_TAX_PRICE = "SET_TAX_PRICE";

export const getUser = () => ({
    type: GET_USER
});

export const startLoadingUser = () => ({
    type: START_LOADING_USER
});

export const endLoadingUser = () => ({
    type: END_LOADING_USER
});

export const setUser = address => ({
    type: SET_USER,
    payload: address
});

export const startTransaction = txHash => ({
    type: START_TRANSACTION,
    payload: txHash
});

export const endTransaction = () => ({
    type: END_TRANSACTION
});

export const setBlendingPrice = price => ({
    type: SET_TAX_PRICE,
    payload: price
});

export const startPlaying = () => {
    return {
        type: START_PLAYING
    };
};

export const requestMove = (
    targetAddress = undefined,
    targetShip = undefined
) => ({
    type: REQUEST_MOVE,
    payload: {
        targetAddress,
        targetShip
    }
});
