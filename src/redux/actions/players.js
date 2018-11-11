import vortex from "../../web3";
import { computeScore } from "../../web3/utils";

export const GET_PLAYERS = "GET_PLAYERS";
export const START_LOADING_PLAYERS = "START_LOADING_PLAYERS";
export const END_LOADING_PLAYERS = "END_LOADING_PLAYERS";
export const SET_PLAYERS = "SET_PLAYERS";
export const NEW_PLAYER = "NEW_PLAYER";
export const ADD_PLAYER = "ADD_PLAYER";
export const UPDATE_PLAYER_LOCATION = "UPDATE_PLAYER_LOCATION";

export const getPlayers = () => ({
    type: GET_PLAYERS
});

export const startLoadingPlayers = () => ({
    type: START_LOADING_PLAYERS
});

export const endLoadingPlayers = () => ({
    type: END_LOADING_PLAYERS
});

export const setPlayers = players => ({
    type: SET_PLAYERS,
    payload: players
});

export const newPlayer = payload => ({
    type: NEW_PLAYER,
    payload
});

export const addPlayer = player => ({
    type: ADD_PLAYER,
    payload: player
});

export const updatePlayerLocation = (
    address,
    location = undefined,
    taxPrice = undefined
) => ({
    type: UPDATE_PLAYER_LOCATION,
    payload: {
        address,
        score: location
            ? computeScore(location, vortex.targetLocation)
            : undefined,
        ship: {
            location,
            taxPrice
        }
    }
});
