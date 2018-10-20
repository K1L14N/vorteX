// import assertRevert from './helpers/assertRevert';
const { assertRevert } = require('./helpers/assertRevert');
const VorteX = artifacts.require('mocks/VorteXMock');

const PLAYING_FEE = 1000000000000000;
const DEFAULT_TAX_PRICE = 10000000000000000;

const EVENT_PLAYER_CREATED = 'PlayerCreated';
const EVENT_TAX_PRICE_SET = 'TaxPriceSet';
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
        it('should return as expected (2, 2)', async function() {
            // make the result even for both coordonates
            const targetLocation = await this.game.getLocation(257/* 0x0101 */);
            assert.equal(targetLocation[0].toNumber(), 2);
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
    
    describe('play', function () {
        it('revert if playing fee is too low', async function () {
            await assertRevert(this.game.play({
                from: player1,
                value: PLAYING_FEE - 1,
            }));
        });

        describe('when playing successful', function() {
            beforeEach(async function() {
                this.initialVorteXBalance = await web3.eth.getBalance(this.game.address);
                const { logs } = await this.game.play({
                    from: player1,
                    value: PLAYING_FEE,
                });
                this.logs = logs;
            });

            it('vortex contract received playing fee', async function() {
                const finalVorteXBalance = await web3.eth.getBalance(this.game.address);
                assert.equal(finalVorteXBalance.toNumber(), this.initialVorteXBalance.toNumber() + PLAYING_FEE);
            });
            it('player is correctly registered', async function() {
                const isPlayer = await this.game.isPlayer(player1);
                assert.isTrue(isPlayer);
            });
            it('PlayerCreated event is emitted', async function() {
                assert.equal(this.logs.length, 1, 'Event is emitted');
                assert.equal(this.logs[0].event, EVENT_PLAYER_CREATED, 'Event is correct');
                assert.equal(this.logs[0].args.player, player1, 'player arg is correct');
                assert.equal(this.logs[0].args.taxPrice, DEFAULT_TAX_PRICE, 'taxPrice arg is correct');
            });
            it('player ship has default values', async function() {
                const ship = await this.game.getShip(player1);
                assert.isTrue(ship[2].toNumber() % 2 === 0);
                assert.isTrue(ship[3].toNumber() % 2 === 0);
                assert.equal(ship[2].toNumber(), ship[0].toNumber());
                assert.equal(ship[3].toNumber(), ship[1].toNumber());
                assert.isAtLeast(ship[2].toNumber(), 0);
                assert.isAtLeast(ship[3].toNumber(), 0);
                assert.isAtMost(ship[2].toNumber(), 256);
                assert.isAtMost(ship[3].toNumber(), 256);
                assert.equal(ship[4].toNumber(), DEFAULT_TAX_PRICE);
            });
            it('revert if a player tries to play a second time', async function() {
                await assertRevert(this.game.play({
                    from: player1,
                    value: PLAYING_FEE,
                }));
            });
        });
    });

    describe('setTaxPrice', function() {
        beforeEach(async function () {
            await this.game.play({
                from: player1,
                value: PLAYING_FEE,
            });
        });

        it('revert if not a player', async function () {
            await assertRevert(this.game.setTaxPrice(0, {
                from: unknown,
            }));
        });

        it('revert if new price is 0', async function () {
            await assertRevert(this.game.setTaxPrice(0, {
                from: player1,
            }));
        });

        describe('when new price is correct', function () {
            beforeEach(async function () {
                const { logs } = await this.game.setTaxPrice(987654321, {
                    from: player1,
                });
                this.logs = logs;
            });

            it('tax price is set', async function () {
                const ship = await this.game.getShip(player1);
                assert.equal(ship[4].toNumber(), 987654321, 'Tax price is set');
            });

            it('TaxPriceSet event emmited', async function () {
                assert.equal(this.logs.length, 1, 'Event is emitted');
                assert.equal(this.logs[0].event, EVENT_TAX_PRICE_SET, 'Event is correct');
                assert.equal(this.logs[0].args.player, player1, 'Player arg is correct');
                assert.equal(this.logs[0].args.taxPrice, 987654321, 'taxPrice arg is correct');
            });
        });
    });

    describe('move', function () {
        beforeEach(async function () {
            await this.game.play({
                from: player1,
                value: PLAYING_FEE,
            });
            this.taxPrice = 987654321;
            await this.game.setTaxPrice(this.taxPrice, {
                from: winningPlayer,
            });
        });

        it('revert if not targeting a player', async function () {
            const targetShip = await this.game.getShip(winningPlayer);
            await assertRevert(this.game.move(
                unknown,
                targetShip[4],
                targetShip[0],
                targetShip[1],
                {
                    from: player1,
                    value: targetShip[4],
                }
            ));
        });

        it('revert if tax price too low', async function () {
            const targetShip = await this.game.getShip(winningPlayer);
            await assertRevert(this.game.move(
                winningPlayer,
                targetShip[4],
                targetShip[0],
                targetShip[1],
                {
                    from: player1,
                    value: targetShip[4] - 1,
                }
            ));
        });

        it('revert if tax price increased', async function () {
            const targetShip = await this.game.getShip(winningPlayer);
            await this.game.setTaxPrice(targetShip[4] + 1, {
                from: winningPlayer,
            });
            await assertRevert(this.game.move(
                winningPlayer,
                targetShip[4],
                targetShip[0],
                targetShip[1],
                {
                    from: player1,
                    value: targetShip[4],
                }
            ));
        });

        describe('when successful move', function () {
            beforeEach(async function () {
                this.initialFeesPlayerBalance = await web3.eth.getBalance(winningPlayer);
                this.initialVorteXBalance = await web3.eth.getBalance(this.game.address);
                this.initialShip = await this.game.getShip(player1);
                this.targetShip = await this.game.getShip(winningPlayer);
                const { logs } = await this.game.move(
                    winningPlayer,
                    this.targetShip[4],
                    this.targetShip[0],
                    this.targetShip[1],
                    {
                        from: player1,
                        value: this.targetShip[4],
                    }
                );
                this.logs = logs;
            });

            it('own location changed', async function () {
                const ship = await this.game.getShip(player1);
                assert.equal(
                    ship[0].toNumber(),
                    Math.floor((this.initialShip[0].toNumber() + this.targetShip[0].toNumber()) / 2)
                );
                assert.equal(
                    ship[1].toNumber(),
                    Math.floor((this.initialShip[1].toNumber() + this.targetShip[1].toNumber()) / 2)
                );
            });

            it('fees have been correctly transfered', async function () {
                const finalFeesPlayerBalance = await web3.eth.getBalance(winningPlayer);
                const finalVorteXBalance = await web3.eth.getBalance(this.game.address);
                const taxPlayerFee = Math.floor(this.targetShip[4] / 2);
                const vorteXFee = this.targetShip[4] - taxPlayerFee;
                assert.equal(finalVorteXBalance.sub(this.initialVorteXBalance).sub(vorteXFee).toNumber(), 0);
                assert.equal(
                    finalFeesPlayerBalance.sub(this.initialFeesPlayerBalance).sub(taxPlayerFee).toNumber(),
                    0
                );
            });

            it('ShipMoved event emmited', async function () {
                const ship = await this.game.getShip(player1);
                assert.equal(this.logs.length, 1, 'Event is emitted');
                assert.equal(this.logs[0].event, EVENT_SHIP_MOVED, 'Event is correct');
                assert.equal(this.logs[0].args.player, player1, 'Player arg is correct');
                assert.equal(this.logs[0].args.x, ship[0].toNumber(), 'X is correct');
                assert.equal(this.logs[0].args.y, ship[1].toNumber(), 'Y is correct');
            });
        });

        it('revert if new location does not match arguments', async function () {
            const targetShip = await this.game.getShip(winningPlayer);
            await assertRevert(this.game.move(
                winningPlayer,
                targetShip[4],
                36, // instead of targetShip[0]
                53, // instead of targetShip[1]
                {
                    from: player1,
                    value: targetShip[4],
                }
            ));
        });
    });

    describe('defaultMove', function () {
        beforeEach(async function () {
            await this.game.play({
                from: player1,
                value: PLAYING_FEE,
            });

            // Change ship location
            const targetShip = await this.game.getShip(winningPlayer);
            await this.game.move(
                winningPlayer,
                targetShip[4],
                targetShip[0],
                targetShip[1],
                {
                    from: player1,
                    value: targetShip[4],
                }
            );
        });

        it('revert if not a player', async function () {
            await assertRevert(this.game.defaultMove(
                {
                    from: unknown,
                    value: DEFAULT_TAX_PRICE,
                }
            ));
        });

        it('revert if tax price is too low', async function () {
            await assertRevert(this.game.defaultMove(
                {
                    from: player1,
                    value: DEFAULT_TAX_PRICE - 2, // Strange behavior when doing -1
                }
            ));
        });

        describe('when successful move', function () {
            beforeEach(async function () {
                this.initialVorteXBalance = await web3.eth.getBalance(this.game.address);
                this.initialShip = await this.game.getShip(player1);
                const { logs } = await this.game.defaultMove(
                    {
                        from: player1,
                        value: DEFAULT_TAX_PRICE,
                    }
                );
                this.logs = logs;
            });

            it('ship location changed', async function () {
                const ship = await this.game.getShip(player1);
                assert.equal(
                    ship[0].toNumber(),
                    Math.floor((this.initialShip[0].toNumber() + this.initialShip[2].toNumber()) / 2)
                );
                assert.equal(
                    ship[1].toNumber(),
                    Math.floor((this.initialShip[1].toNumber() + this.initialShip[3].toNumber()) / 2)
                );
            });

            it('ShipMoved event emmited', async function () {
                const ship = await this.game.getShip(player1);
                assert.equal(this.logs.length, 1, 'Event is emitted');
                assert.equal(this.logs[0].event, EVENT_SHIP_MOVED, 'Event is correct');
                assert.equal(this.logs[0].args.player, player1, 'Player arg is correct');
                assert.equal(this.logs[0].args.x, ship[0].toNumber(), 'X is correct');
                assert.equal(this.logs[0].args.y, ship[1].toNumber(), 'Y is correct');
            });
        });
    });

    describe('claimVictory', function () {
        beforeEach(async function () {
            await this.game.play({
                from: player1,
                value: PLAYING_FEE,
            });
        });

        it('revert if not a player', async function () {
            await assertRevert(this.game.claimVictory(
                {
                    from: unknown,
                }
            ));
        });

        it('revert if not winner', async function () {
            await assertRevert(this.game.claimVictory(
                {
                    from: player1,
                }
            ));
        });

        describe('when successful winning claimed', function () {
            beforeEach(async function () {
                this.initialVorteXBalance = await web3.eth.getBalance(this.game.address);
                this.initialWinnerBalance = await web3.eth.getBalance(winningPlayer);
                this.receipt = await this.game.claimVictory({
                    from: winningPlayer,
                    gasPrice: 0,
                });
            });

            it('vortex balance has been transfered to winner', async function () {
                const finalVorteXBalance = await web3.eth.getBalance(this.game.address);
                const finalWinnerBalance = await web3.eth.getBalance(winningPlayer);

                assert.equal(finalVorteXBalance.toNumber(), 0);
                assert.equal(
                    finalWinnerBalance.sub(this.initialWinnerBalance).sub(this.initialVorteXBalance).toNumber(),
                    0
                );
            });

            describe('Game should be over', function () {
                it('gameOver should be set to true', async function () {
                    const gameOver = await this.game.gameOver();
                    assert.isTrue(gameOver);
                });

                describe('Methods should be innaccessible', function () {
                    it('play', async function () {
                        await assertRevert(this.game.play({
                            from: player2,
                            value: PLAYING_FEE,
                        }));
                    });

                    it('move', async function () {
                        this.targetShip = await this.game.getShip(winningPlayer);
                        await assertRevert(this.game.move(
                            winningPlayer,
                            this.targetShip[4],
                            this.targetShip[0],
                            this.targetShip[1],
                            {
                                from: player1,
                                value: this.targetShip[4],
                            }
                        ));
                    });

                    it('defaultMove', async function () {
                        await assertRevert(this.game.defaultMove({
                            from: player1,
                            value: DEFAULT_TAX_PRICE,
                        }
                        ));
                    });

                    it('claimVictory', async function () {
                        await assertRevert(this.game.claimVictory({
                            from: winningPlayer,
                        }
                        ));
                    });
                });
            });

            it('PlayerWon event emmited', async function () {
                const logs = this.receipt.logs;
                assert.equal(logs.length, 1, 'Event is emitted');
                assert.equal(logs[0].event, EVENT_PLAYER_WON, 'Event is correct');
                assert.equal(logs[0].args.player, winningPlayer, 'Player arg is correct');
            });
        });
    });
});