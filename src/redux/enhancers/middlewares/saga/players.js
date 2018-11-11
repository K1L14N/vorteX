import {
    call,
    put,
    takeLatest,
    takeEvery,
    all,
    take
} from "redux-saga/effects";
import generator from "mnemonic-generator";

import {
    startLoadingPlayers,
    endLoadingPlayers,
    setPlayers,
    addPlayer,
    updatePlayerLocation,
    newPlayer
} from "../../../actions/players";
import { addError } from "../../../actions/errors";
import { GET_PLAYERS, NEW_PLAYER } from "../../../actions/players";
import vortex from "../../../../web3";
import { computeScore, location } from "../../../../web3/utils";

import {
    taxPriceSetEmitter,
    shipMovedEmitter,
    playerCreatedEmitter
} from "./eventEmitters";

/** ******* WORKERS *********/

function* getPlayersSaga() {
    try {
        yield put(startLoadingPlayers());
        const playerAddresses = yield call(vortex.getPlayers);
        const ships = yield Promise.all(
            playerAddresses.map(address => vortex.getShip(address))
        );
        const players = {};
        for (let i = 0; i < playerAddresses.length; i++) {
            players[playerAddresses[i]] = {
                address: playerAddresses[i],
                pseudo: generator(playerAddresses[i]),
                ship: ships[i],
                score: computeScore(ships[i].location, vortex.targetLocation)
            };
        }
        yield put(setPlayers(players));
    } catch (err) {
        console.log(err);
        yield put(addError("Unable to retrieve the players."));
    } finally {
        yield put(endLoadingPlayers());
    }
}

function* newPlayerSaga({ address, ship }) {
    try {
        const player = {
            address,
            pseudo: generator(address),
            ship: ship,
            score: computeScore(ship.location, vortex.targetLocation)
        };
        console.log("IN SAGA newPlayerSaga");
        yield put(addPlayer(player));
    } catch (err) {
        yield put(addError("Unable to add a player."));
    } finally {
    }
}

/** ******* EVENT LISTENERS *********/

function* listenTaxPrice() {
    const chan = yield call(taxPriceSetEmitter);
    try {
        while (true) {
            let { player, price } = yield take(chan);
            console.log("TaxPriceEmitter event!");
            yield put(updatePlayerLocation(player, undefined, price));
        }
    } finally {
    }
}

function* listenShipMoved() {
    const chan = yield call(shipMovedEmitter);
    try {
        while (true) {
            let { player, r, g, b } = yield take(chan);
            console.log("Ship Moved event!");
            yield put(updatePlayerLocation(player, location([r, g, b])));
        }
    } finally {
    }
}

function* listenPlayerCreated() {
    const chan = yield call(playerCreatedEmitter);
    try {
        while (true) {
            let { address, ship } = yield take(chan);
            console.log("New Player event!");
            yield put(newPlayer({ address, ship }));
        }
    } finally {
    }
}

/** ******* WATCHERS *********/

function* watchGetPlayers() {
    yield takeLatest(GET_PLAYERS, getPlayersSaga);
}

function* watchNewPlayer() {
    yield takeEvery(NEW_PLAYER, ({ payload }) =>
        newPlayerSaga({ address: payload.address, ship: payload.ship })
    );
}

function* playersSaga() {
    yield all([
        watchGetPlayers(),
        watchNewPlayer(),
        listenTaxPrice(),
        listenShipMoved(),
        listenPlayerCreated()
    ]);
}

export default playersSaga;
