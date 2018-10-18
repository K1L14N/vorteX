pragma solidity ^0.4.24;

/**
 * @title VorteX
 *
 * @dev VorteX contract
 * VorteX is a game in which players navigate in the the crypto space.
 * Players can move along specific directions: spaceships.
 * Players are required to pay some fee to perform action in the game.
 * The goal is to reach a beacon called the `vorteX`
 *
 * Rules:
 * 1. Playing: To start playing, a player needs to pay a certain amount of Ether to the VorteX contract
 * 2. Navigating: Because you travel faster than the speed of light, you have a select a known target (spaceship of other player or your inital location).
 *    To navigate, you need to pay a tax to the destination that is set by the player.
 *    In case of players, half of the amount paid is given to the selected player and half to the VorteX smart contract,
 *    In case you chose your initial location, the tax is sent to the smart contract. The tax of a station depends on its distance with the vorteX
 * 3. Winning: To winner is the first player to reach the vorteX which is a small area in the crypto space.
 *    The talented winner gets all ETH that have been transfered to the VorteX contract during the game
 * */

contract VorteX {
    
    struct Location {
        uint x;
        uint y;
    }

    /* Ship struct */
    struct Ship {
        Location initialLocation;
        Location location;
        uint taxPrice;
    }

    /* Fee */
    uint constant public PLAYING_FEE = 1000000000000000;
    uint constant public DEFAULT_TAX_PRICE = 10000000000000000;

    /* VorteX location */
    Location public vortexLocation;

    /* Boolean indicating if a player won the game */
    bool public gameOver = false;

    /* Mapping containing positions of the players */
    mapping(address => Ship) ships;

    /* Array listing players */
    address[] players;

    /* Throw if the sender is not a player*/
    modifier onlyPlayer() {
        require(isPlayer(msg.sender), "You are not a player");
        _;
    }

    /* Throw if game is over */
    modifier gameInProgress() {
        require(!isGameOver(), "Game is over");
        _;
    }

    /* Emmited each time a player join the game */
    event PlayerCreated(
        address indexed player,
        uint x,
        uint y,
        uint taxPrice
    );

    /* Emmited each time a player modifies its tax price */
    event TaxPriceSet(
        address indexed player,
        uint taxPrice
    );

    /* Emmited each time a mouvement is made */
    event ShipMoved(
        address indexed player,
        uint x,
        uint y
    );

    /* Emmited when a player has won */
    event PlayerWon(
        address indexed player
    );

    /**
     * @dev Start a new vorteX Game
     * @param _x Target X location or the vorteX
     * @param _y Target Y location of the vorteX
     */
    constructor(
        uint _x,
        uint _y
    )
        public
    {
        vortexLocation = Location(_x, _y);
    }

    /**
     * @dev Get players
     */
    function getPlayers() 
        public
        view
        returns (address[])
    {
        return players;
    }

    /**
     * @dev Get player information
     * @param _player Player address
     */
    function getShip(
        address _player
    )
        public
        view
        returns (uint[3])
    {
        Ship memory ship = ships[_player];
        return [
            ship.location.x,
            ship.location.y,
            ship.taxPrice
        ];
    }

     /**
     * @dev Check if a player exists
     * @param _player Player address
     */
    function isPlayer(
        address _player
    )
        public
        view
        returns (bool)
    {
        // tax price can not be set to 0
        return ships[_player].taxPrice > 0;
    }

     /**
     * @dev Check if the game is over
     */
    function isGameOver()
        public
        view
        returns (bool)
    {
        return gameOver;
    }


}