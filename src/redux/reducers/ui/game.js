import { JOIN } from "../../actions/ui";

const initialState = {
    gameOver: true
};

export default (state = initialState, { type }) => {
    switch (type) {
        case JOIN:
            return {
                ...state,
                gameOver: false
            };

        default:
            return state;
    }
};
