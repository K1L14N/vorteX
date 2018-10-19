// import assertRevert from './helpers/assertRevert';
const { assertRevert } = require('./helpers/assertRevert');
const VorteX = artifacts.require('mocks/VorteXMock');

const PLAYING_FEE = 1000000000000000;
const DEFAULT_TAX_PRICE = 10000000000000000;

const EVENT_PLAYER_CREATED = 'PlayerCreated';
const EVENT_TAX_PRICE_SET = 'BlendingPriceSet';
const EVENT_SHIP_MOVED = 'ShipMoved';
const EVENT_PLAYER_WON = 'PlayerWon';

contract('VorteX', function ([player1, player2, winningPlayer, unknown]) {
    beforeEach(async function () {
        this.xy = [37, 54];
        this.game = await VorteX.new(
            this.xy[0],
            this.xy[1],
            {
                from: winningPlayer,
                value: PLAYING_FEE,
            });
    });

    describe('targetLocation', function () {
        it('target location is set correctly', async function () {
            const targetLocation = await this.game.vortexLocation();
            assert.equal(targetLocation[0].toNumber(), this.xy[0]);
            assert.equal(targetLocation[1].toNumber(), this.xy[1]);
        });
    });

    describe('getPlayers', function () {
        it('only winning player is registered', async function () {
            const players = await this.game.getPlayers();
            assert.lengthOf(players, 1);
            assert.equal(players[0], winningPlayer);
        });
    });

    describe('getXY', function () {
        it('should return as expected (0, 0)', async function() {
            const targetLocation = await this.game.getLocation(0);
            assert.equal(targetLocation[0].toNumber(), 0);
            assert.equal(targetLocation[1].toNumber(), 0);
        });
        it('should return as expected (0, 2)', async function() {
            // make the result even
            const targetLocation = await this.game.getLocation(1);
            assert.equal(targetLocation[0].toNumber(), 0);
            assert.equal(targetLocation[1].toNumber(), 2);
        });
        it('should return as expected (256, 256)', async function() {
            const targetLocation = await this.game.getLocation(0xffff);
            assert.equal(targetLocation[0].toNumber(), 256);
            assert.equal(targetLocation[1].toNumber(), 256);
        });
        it('should return as expected (256, 256)', async function() {
            const targetLocation = await this.game.getLocation(0xffffffffffff);
            assert.equal(targetLocation[0].toNumber(), 256);
            assert.equal(targetLocation[1].toNumber(), 256);
        });
        it('should return as expected (128, 128)', async function() {
            const targetLocation = await this.game.getLocation(32896 /* 0b1000000010000000 */);
            assert.equal(targetLocation[0].toNumber(), 128);
            assert.equal(targetLocation[1].toNumber(), 128);
        });
    })

    describe('isGameOver', function() {
        it('game is not over at start', async function() {
            const gameOver = await this.game.isGameOver();
            assert.equal(gameOver, false);
        });
    });

    describe('isPlayer', function() {
        it('should be a player', async function() {
            const isAPlayer = await this.game.isPlayer(winningPlayer);
            assert.equal(isAPlayer, true);
        });
    })

    describe('play', function () {
        it('revert if playing fee is too low', async function () {
            await assertRevert(this.game.play({
                from: player1,
                value: PLAYING_FEE - 1,
            }));
        });
    });

    // describe('toEven', function() {
    //     it('should return as expected 22', async function() {
    //         const evenNumber = await this.game.toEven(21);
    //         assert.equal(evenNumber, 22);
    //     });
    // });
    // describe('setTaxPrice', function() {
    //     it('sets the tax price', async function() {
    //         const taxSet = await this.game.setTaxPrice(11111);
    //         assert.equal(taxSet, true);
    //     });
    // });
});