import { call, put, select, takeLatest, all, take } from "redux-saga/effects";
import generator from "mnemonic-generator";

import {
    startLoadingUser,
    endLoadingUser,
    setUser,
    startTransaction,
    endTransaction
} from "../../../actions/user";
import { addError, removeError } from "../../../actions/errors";
import {
    GET_USER,
    START_PLAYING,
    REQUEST_MOVE,
    SET_TAX_PRICE
} from "../../../actions/user";
import vortex, { web3 } from "../../../../web3";

/** ******* WORKERS *********/
function* getUserSaga() {
    try {
        yield put(startLoadingUser());
        const [address] = yield call(web3.eth.getAccounts);
        const user = {
            address,
            pseudo: generator(address)
        };
        yield put(setUser(user));
        yield put(removeError());
    } catch (err) {
        yield put(addError("Unable to access an account."));
    } finally {
        yield put(endLoadingUser());
    }
}

function* startPlayingSaga() {
    const address = yield select(state => state.user.data.address);
    const chan = yield call(vortex.play, address);
    try {
        while (true) {
            let { txHash, receipt, error } = yield take(chan);
            if (txHash && !receipt && !error) {
                console.log("TX HASH");
                yield put(startTransaction(txHash));
            } else if (!txHash && receipt && !error) {
                console.log("RECEIPT");
                chan.close();
            } else if (!txHash && !receipt && error) {
                console.log("ERROR");
                yield put(addError("Transaction has failed."));
                chan.close();
            } else {
                console.log("WOOPS");
                chan.close();
            }
        }
    } finally {
        yield put(endTransaction());
    }
}

function* blendSaga(targetAddress, targetLocation) {
    const address = yield select(state => state.user.data.address);
    const chan = yield call(
        vortex.blend,
        address,
        targetAddress,
        targetLocation
    );
    try {
        while (true) {
            let { txHash, receipt, error } = yield take(chan);
            if (txHash && !receipt && !error) {
                console.log("TX HASH");
                yield put(startTransaction(txHash));
            } else if (!txHash && receipt && !error) {
                console.log("RECEIPT");
                chan.close();
            } else if (!txHash && !receipt && error) {
                console.log("ERROR");
                yield put(addError("Transaction has failed."));
                chan.close();
            } else {
                console.log("WOOPS");
                chan.close();
            }
        }
    } finally {
        yield put(endTransaction());
    }
}

function* setTaxPriceSaga(price) {
    const address = yield select(state => state.user.data.address);
    const chan = yield call(vortex.setBlendingPrice, address, price);
    try {
        while (true) {
            let { txHash, receipt, error } = yield take(chan);
            if (txHash && !receipt && !error) {
                console.log("TX HASH");
                yield put(startTransaction(txHash));
            } else if (!txHash && receipt && !error) {
                console.log("RECEIPT");
                chan.close();
            } else if (!txHash && !receipt && error) {
                console.log("ERROR");
                yield put(addError("Transaction has failed."));
                chan.close();
            } else {
                console.log("WOOPS");
                chan.close();
            }
        }
    } finally {
        yield put(endTransaction());
    }
}

/** ******* WATCHERS *********/

function* watchGetUser() {
    yield takeLatest(GET_USER, getUserSaga);
}

function* watchStartPlaying() {
    yield takeLatest(START_PLAYING, startPlayingSaga);
}

function* watchRequestMove() {
    yield takeLatest(
        REQUEST_MOVE,
        ({ payload: { targetAddress, targetLocation } }) =>
            blendSaga(targetAddress, targetLocation)
    );
}

function* watchSetTaxPrice() {
    yield takeLatest(SET_TAX_PRICE, ({ payload }) => setTaxPriceSaga(payload));
}

/** ******* SAGA *********/

function* userSaga() {
    yield all([
        watchGetUser(),
        watchStartPlaying(),
        watchRequestMove(),
        watchSetTaxPrice()
    ]);
}

export default userSaga;
