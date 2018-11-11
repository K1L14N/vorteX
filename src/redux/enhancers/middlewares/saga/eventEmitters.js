import { eventChannel } from "redux-saga";

import { VorteXWs } from "../../../../web3";

export function taxPriceSetEmitter() {
    return eventChannel(emitter => {
        VorteXWs.TaxPriceSet({}, undefined)
            .on("data", event => {
                const { player, taxPrice } = event.returnValues;
                emitter({ player, taxPrice });
            })
            .on("error", err => console.log(err));
        return () => false;
    });
}

export function shipMovedEmitter() {
    return eventChannel(emitter => {
        VorteXWs.ShipMoved({}, undefined)
            .on("data", event => {
                const { player, x, y } = event.returnValues;
                emitter({ player, x, y });
            })
            .on("error", console.log);
        return () => false;
    });
}

export function playerCreatedEmitter() {
    return eventChannel(emitter => {
        VorteXWs.PlayerCreated({}, undefined)
            .on("data", event => {
                const { player, x, y, taxPrice } = event.returnValues;
                const token = {
                    taxPrice,
                    location: { x, y },
                    initialLocation: { x, y }
                };
                emitter({ address: player, token });
            })
            .on("error", console.log);
        return () => false;
    });
}

export function playerWonEmitter() {
    return eventChannel(emitter => {
        VorteXWs.PlayerWon({}, undefined)
            .on("data", event => {
                const { player } = event.returnValues;
                emitter({ player });
            })
            .on("error", console.log);
        return () => false;
    });
}
