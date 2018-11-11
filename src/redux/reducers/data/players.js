import {
    START_LOADING_PLAYERS,
    END_LOADING_PLAYERS,
    SET_PLAYERS,
    UPDATE_PLAYER_LOCATION,
    ADD_PLAYER
} from "../../actions/players";

const DEFAULT_STATE = {
    isLoading: true,
    data: {}
};

export default (state = DEFAULT_STATE, { type, payload }) => {
    switch (type) {
        case START_LOADING_PLAYERS:
            return { ...state, isLoading: true };
        case END_LOADING_PLAYERS:
            return { ...state, isLoading: false };
        case SET_PLAYERS:
            return { ...state, data: payload };
        case ADD_PLAYER:
            console.log("IN REDUCER");
            return {
                ...state,
                data: {
                    ...state.data,
                    [payload.address]: payload
                }
            };
        case UPDATE_PLAYER_LOCATION:
            const player = state.data[payload.address];
            if (player) {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        [player.address]: {
                            ...player,
                            score: payload.score || player.score,
                            ship: {
                                ...player.ship,
                                location:
                                    payload.ship.location ||
                                    player.ship.location,
                                taxPrice:
                                    payload.ship.taxPrice ||
                                    player.ship.taxPrice
                            }
                        }
                    }
                };
            } else {
                return state;
            }
        default:
            return state;
    }
};
