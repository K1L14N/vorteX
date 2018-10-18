import assertRevert from './helpers/assertRevert';
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
});