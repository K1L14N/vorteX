pragma solidity ^0.4.24;

import { VorteX } from "../VorteX.sol";

contract VorteXMock is VorteX {
    constructor(
        uint _x,
        uint _y
    )
        public
        payable
        VorteX(_x, _y)
    {
        players.push(msg.sender);
        ships[msg.sender] = Ship(vortexLocation, vortexLocation, DEFAULT_TAX_PRICE);
    }
}
