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
        returns (uint[5])
    {
        Ship memory ship = ships[_player];
        return [
            ship.location.x,
            ship.location.y,
            ship.initialLocation.x,
            ship.initialLocation.y,
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

     /**
     * @dev Register transaction sender has a new player
     */
    function play()
        public
        payable
        gameInProgress
        returns (bool)
    {
        // The sender must not be already a player
        require(!isPlayer(msg.sender), "Already a player");

        // Sender must have paid gaming to start playing
        require(msg.value >= PLAYING_FEE, "Playing fee has not been paid");

        // Compute player default location (try to make it tough for a player to anticipate default location)
        bytes32 defaultLocationSeed = keccak256(
            abi.encodePacked(
                msg.sender,
                blockhash(block.number - 1),
                block.coinbase,
                block.timestamp
            )
        );
        uint[2] memory defaultXY = getLocation(uint(defaultLocationSeed));
        Location memory defaultLocation = Location(defaultXY[0], defaultXY[1]);

        // Register player
        players.push(msg.sender);
        ships[msg.sender] = Ship(defaultLocation, defaultLocation, DEFAULT_TAX_PRICE);

        // Emit event
        emit PlayerCreated(
            msg.sender,
            defaultLocation.x,
            defaultLocation.y,
            DEFAULT_TAX_PRICE
        );

        return true;
    }

     /**
     * @dev set the tax price, has to be > 0
     */
    function setTaxPrice(
        uint _newPrice
    )
        public
        gameInProgress
        onlyPlayer
        returns (bool)
    {
        require(_newPrice > 0, "Tax Price must be strictly positive");
        ships[msg.sender].taxPrice = _newPrice;

        emit TaxPriceSet(
            msg.sender,
            _newPrice
        );
        return true;
    }

     /**
     * @dev Move player location to another player according to a distance
     * @param _targetPlayer Player to target
     * @param _taxPrice Tax price fixed by the target
     * @param _targetX X position of the target
     * @param _targetY Y position of the target
     */
    function move(
        address _targetPlayer,
        uint _taxPrice,
        uint _targetX,
        uint _targetY
    )
        public
        payable
        gameInProgress
        onlyPlayer
        returns (bool)
    {
        // Must target a player
        require(isPlayer(_targetPlayer), "You must target a player");

        // Get ship of the target player
        Ship memory targetShip = ships[_targetPlayer];

        // Ensure tax price of the target has not increased while transaction was pending
        require(_taxPrice >= targetShip.taxPrice, "Tax price has increased");

        // The sender must have transfer enough value to move
        require(msg.value >= targetShip.taxPrice, "Not enought transfered Ether");

        // Ensure ship location has not been modified while transaction was pending
        require(
            _targetX == targetShip.location.x && _targetY == targetShip.location.y,
            "Ship location has changed"
        );

        // Move current player to half the distance between the target
        Ship storage ship = ships[msg.sender];
        ship.location.x = (ship.location.x + targetShip.location.x) / 2;
        ship.location.y = (ship.location.y + targetShip.location.y) / 2;

        // Pay tax price to the target player
        _targetPlayer.transfer(msg.value / 2);

        // Emit event
        emit ShipMoved(
            msg.sender,
            ship.location.x,
            ship.location.y
        );

        return true;
    }

    /**
    * @dev Move with initial ship location
    */
    function defaultMove()
        public
        payable
        gameInProgress
        onlyPlayer
        returns (bool)
    {
        // Player needs to transfer minimum tax price
        require(msg.value >= DEFAULT_TAX_PRICE, "Default tax fee has not been paid");

        // Move current player to half the distance between the target
        Ship storage ship = ships[msg.sender];
        ship.location.x = (ship.location.x + ship.initialLocation.x) / 2;
        ship.location.y = (ship.location.y + ship.initialLocation.y) / 2;

        // Emit event
        emit ShipMoved(
            msg.sender,
            ship.location.x,
            ship.location.y
        );

        return true;
    }

     /**
     * @dev Current player claim victory
     */
    function claimVictory()
        public
        onlyPlayer
        gameInProgress
        returns (bool)
    {
        // Test player token has a winning color
        Location memory location = ships[msg.sender].location;
        require(location.x == vortexLocation.x && location.y == vortexLocation.y, "Not winner");

        // Transfer winning prize
        msg.sender.transfer(address(this).balance);

        // End game
        gameOver = true;

        // Emit event
        emit PlayerWon(
            msg.sender
        );

        return true;
    }

     /**
     * @dev Compute location values based on a seed
     * @param _seed Simulated random number
     */
    function getLocation(
        uint _seed
    )
        public
        pure
        returns (uint[2])
    {
        return [
            toEven(uint16((_seed & 0xff00) / 0xff)),
            toEven(uint16(_seed & 0xff))
        ];
    }

     /**
     * @dev Pushes a component of a location to its closest even number
     * @param _component The component of the location
     */
    function toEven(
        uint16 _component
    )
        internal
        pure
        returns (uint)
    {
        if (_component % 2 == 0) {
            return _component;
        } else {
            return _component + 1;
        }
    }

}