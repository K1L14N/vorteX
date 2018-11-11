import Web3 from "web3";
import { eventChannel } from "redux-saga";

import { abi } from "./abis/VorteX.json";
import { computeShip, location } from "./utils";

// Ganache on 7545
const contractAddress = "0x7cc4b1851c35959d34e635a470f6b5c43ba3c9c9";

export const web3 = new Web3(Web3.givenProvider);

export const web3Ws =
    process.env.NODE_END === "development"
        ? new Web3("wss://localhost:7545")
        : new Web3(
              new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws")
          );

const VorteX = new web3.eth.Contract(abi, contractAddress);
export const VorteXWs = new web3Ws.eth.Contract(abi, contractAddress).events;
const targetLocation = location([128, 128]); // For development
const defaultTaxPrice = 10000000000000000;

export default {
    targetLocation,
    defaultTaxPrice,
    getShip: playerAddress =>
        VorteX.methods
            .getShip(playerAddress)
            .call()
            .then(computeShip),
    isPlayer: address => VorteX.methods.isPlayer(address).call(),
    getPlayers: () => VorteX.methods.getPlayers().call(),
    play: address => {
        return eventChannel(emitter => {
            VorteX.methods
                .play()
                .send({
                    from: address,
                    value: defaultTaxPrice,
                    gasLimit: 500000
                })
                .on("transactionHash", txHash => {
                    console.log("Transaction hash: ", txHash);
                    emitter({ txHash, receipt: undefined, error: undefined });
                })
                .on("receipt", receipt => {
                    console.log("Receipt: ", receipt);
                    emitter({ txHash: undefined, receipt, error: undefined });
                })
                .on("error", error => {
                    console.log(error);
                    emitter({ txHash: undefined, receipt: undefined, error });
                });
            return () => false;
        });
    },
    setTaxPrice: (address, newPrice) => {
        return eventChannel(emitter => {
            VorteX.methods
                .setTaxPrice(newPrice)
                .send({
                    from: address
                })
                .on("transactionHash", txHash => {
                    console.log("Transaction hash: ", txHash);
                    emitter({ txHash, receipt: undefined, error: undefined });
                })
                .on("receipt", receipt => {
                    console.log("Receipt: ", receipt);
                    emitter({ txHash: undefined, receipt, error: undefined });
                })
                .on("error", error => {
                    console.log(error);
                    emitter({ txHash: undefined, receipt: undefined, error });
                });
            return () => false;
        });
    },
    move: (address, targetPlayer, targetLocation) => {
        let eventEmitter;
        if (targetPlayer) {
            eventEmitter = VorteX.methods
                .move(
                    targetPlayer,
                    targetLocation.taxPrice,
                    targetLocation.position.x,
                    targetLocation.position.y
                )
                .send({
                    from: address,
                    value: targetLocation.taxPrice
                });
        } else {
            eventEmitter = VorteX.methods.defaultMove().send({
                from: address,
                value: defaultTaxPrice
            });
        }
        return eventChannel(emitter => {
            eventEmitter
                .on("transactionHash", txHash => {
                    console.log("Transaction hash: ", txHash);
                    emitter({ txHash, receipt: undefined, error: undefined });
                })
                .on("receipt", receipt => {
                    console.log("Receipt: ", receipt);
                    emitter({ txHash: undefined, receipt, error: undefined });
                })
                .on("error", error => {
                    console.log(error);
                    emitter({ txHash: undefined, receipt: undefined, error });
                });
            return () => false;
        });
    },
    claimVictory: address => {
        return eventChannel(emitter => {
            VorteX.methods
                .claimVictory()
                .send({
                    from: address
                })
                .on("transactionHash", txHash => {
                    console.log("Transaction hash: ", txHash);
                    emitter({ txHash, receipt: undefined, error: undefined });
                })
                .on("receipt", receipt => {
                    console.log("Receipt: ", receipt);
                    emitter({ txHash: undefined, receipt, error: undefined });
                })
                .on("error", error => {
                    console.log(error);
                    emitter({ txHash: undefined, receipt: undefined, error });
                });
        });
    }
};
