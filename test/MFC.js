const ethers = require('ethers');
const helpers = require('./../src/js/lib/helpers.js');

const MFC = artifacts.require("MFC");

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const FINNEY = 10 ** 15;
// const ETHER = 10 ** 18;

String.prototype.encodeHex = function () {
    return this.split('').map(e => e.charCodeAt())
};
describe("Utils", () => {
    it('converts string to bytes', () => {
        assert.equal('0x48000000', helpers.toHex("H"));
    });
    it('converts bytes to string', () => {
        assert.equal('H', helpers.toString("0x48000000"));
    });
    it('converts emoji string to bytes', () => {
        assert.equal('0xf09f9881', helpers.toHex("😁"));
    });
    it('converts bytes to emoji string', () => {
        assert.equal('😁', helpers.toString("0xf09f9881"));
    });
});
contract('MFC', function(accounts) {
    const [firstAccount, secondAccount, thirdAccount] = accounts;

    let mfc;
    beforeEach(async () => {
        mfc = await MFC.new(1 * FINNEY);
    });

    describe('Read', () => {
        it("0 x 0 is available", async () => {
            let [char, attachment, colour, buyer] = await mfc.read(0, 0);
            assert.equal("0x00000000", char);
            assert.equal("", attachment);
            assert.equal("0x000000", colour);
            assert.equal("0x0000000000000000000000000000000000000000", buyer);


        });
        it("can read box price", async () => {
            const price = await mfc.BOX_PRICE({from: secondAccount});
            assert.equal(1 * FINNEY, price);
        });
        it('can listen for bought events', async () => {

            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});
            let bought = [];
            mfc.BoxBought({fromBlock: 0, toBlock: 'latest'}, function (err, event) {
                bought.push(event.args['x'].toNumber() + 'x' + event.args['y'].toNumber());
            });
            await sleep(200);
            assert.equal("0x0", bought[0]);
            assert.equal("1x0", bought[1]);
            assert.equal("0x1", bought[2]);
            assert.equal("1x1", bought[3]);
            assert.equal(4, bought.length);

        });
        it('can listen for published events', async () => {

            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});
            await mfc.publishBlock(0, 0, "A B", "", "0xff0000", {from: secondAccount});

            let published = [];
            mfc.BoxPublished({fromBlock: 0, toBlock: 'latest'}, function (err, event) {
                published.push(event.args['x'].toNumber() + 'x' + event.args['y'].toNumber() + ': ' + helpers.toString(event.args['char']));
            });

            await sleep(200);
            assert.equal("0x0: A", published[0]);
            assert.equal("1x0: B", published[1]);
            assert.equal(2, published.length);

        });
        it("can't read invalid location", async() => {
            try{
                let [char, attachment, colour, buyer] = await mfc.read(101, 101);
                assert.fail();
            } catch (e){
                assert.ok(/revert/.test(e.message));
            }

        });
        it("can read the buyers array", async() => {
            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});
            await mfc.buy(5, 0, 2, 2, {from: thirdAccount, value: 4 * FINNEY});
            let buyers = await mfc.boardBuyers();
            assert.equal(100*100, buyers.length);
            assert.equal(secondAccount,buyers[0] );
            assert.equal(thirdAccount, buyers[105] );
            assert.equal('0x0000000000000000000000000000000000000000', buyers[2] );

        });
        it("can read the board chars", async () => {
            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});
            await mfc.publishBlock(0, 0, "A B", "", "0xff0000", {from: secondAccount});
            let board = await mfc.boardChars({gas: 7000000});
            console.log(board);
        });
    });

    describe("Buy",  () => {
        it("buys free boxes", async () => {

            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});
            [char, attachment, colour, buyer] = await mfc.read(0, 0);
            assert.equal(secondAccount, buyer);
            [char, attachment, colour, buyer] = await mfc.read(1, 1);
            assert.equal(secondAccount, buyer);
            [char, attachment, colour, buyer] = await mfc.read(1, 2);
            assert.equal("0x0000000000000000000000000000000000000000", buyer);


        });
        it("can't buy bought boxes", async () => {

            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});
            try{
                await mfc.buy(1, 1, 2, 2,{from: firstAccount, value: 4 * FINNEY});
                assert.fail();
            }catch(e){
                assert.ok(/revert/.test(e.message));
            }



        });
        it("cant pay less", async () => {
            try {
                await mfc.buy(0, 0, 3, 3, {from: secondAccount, value: 8.99 * FINNEY});
                assert.fail();
            } catch (e) {
                assert.ok(/revert/.test(e.message));
            }
        });
        it("can pay more", async () => {

            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4.2 * FINNEY});
            [char, attachment, colour, buyer] = await mfc.read(0, 0);
            assert.equal(secondAccount, buyer);
            [char, attachment, colour, buyer] = await mfc.read(1, 1);
            assert.equal(secondAccount, buyer);
            [char, attachment, colour, buyer] = await mfc.read(1, 2);
            assert.equal("0x0000000000000000000000000000000000000000", buyer);

        });
        it("can't but invalid box", async () => {

            try{
                await mfc.buy(0, 0, 101, 101, {from: secondAccount, value: 101*101 * FINNEY});
                assert.fail();
            } catch (e){
                assert.ok(/revert/.test(e.message));
            }

        });
    });

    describe("Publish", () => {
        it("can publish one box", async () => {
            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});
            /**
             * uint16 x, uint16 y, bytes4 char, string attachment, bytes3 colour
             */

            await mfc.publish(0, 1, helpers.toHex("H"), "", "0xff0000", {from: secondAccount}); // red
            let [char, attachment, colour, buyer] = await mfc.read(0, 1);
            assert.equal("H", helpers.toString(char));
            assert.equal("", attachment);
            assert.equal("0xff0000", colour);
            assert.equal(secondAccount, buyer);

        });

        it("can't publish others box", async () => {
            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});
            await mfc.buy(2, 0, 2, 2, {from: firstAccount, value: 4 * FINNEY});
            /**
             * uint16 x, uint16 y, bytes4 char, string attachment, bytes3 colour
             */

            try{
                await mfc.publish(2, 0, helpers.toHex("H"), "", "0xff0000", {from: secondAccount}); // red
                assert.fail();
            } catch (e){
                assert.ok(/revert/.test(e.message));
            }


        });
        it("can't publish unbought box", async () => {
            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});
            /**
             * uint16 x, uint16 y, bytes4 char, string attachment, bytes3 colour
             */

            try {
                await mfc.publish(2, 0, helpers.toHex("H"), "", "0xff0000", {from: secondAccount}); // red
                assert.fail();
            } catch (e) {
                assert.ok(/revert/.test(e.message));
            }


        });
        it("can't publish unbought box using batch publish", async () => {
            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});
            /**
             * uint16 x, uint16 y, bytes4 char, string attachment, bytes3 colour
             */

            try {
                await mfc.publishBlock(2, 0, "H", "", "0xff0000", {from: secondAccount}); // red
                assert.fail();
            } catch (e) {
                assert.ok(/revert/.test(e.message));
            }


        });
        it("can't publish outside of the board", async () => {
            await mfc.buy(98, 98, 2, 2, {from: secondAccount, value: 4 * FINNEY});
            /**
             * uint16 x, uint16 y, bytes4 char, string attachment, bytes3 colour
             */

            try {
                await mfc.publishBlock(99, 99, "A B", "", "0xff0000", {from: secondAccount}); // C is outside of the board
                assert.fail();
            } catch (e) {
                assert.ok(/revert/.test(e.message));
            }


        });
        it("can publish multiple box", async () => {
            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});
            /**
             * uint16 x, uint16 y, bytes4 char, string attachment, bytes3 colour
             */


            await mfc.publishBlock(0, 0, "A B\nC D", "", "0xff0000", {from: secondAccount}); // red
            let [char, attachment, colour, buyer] = await mfc.read(0, 0);

            assert.equal("A", helpers.toString(char));
            assert.equal("", attachment);
            assert.equal("0xff0000", colour);
            assert.equal(secondAccount, buyer);
            [char, attachment, colour, buyer] = await mfc.read(1, 0);
            assert.equal("B", helpers.toString(char));
            [char, attachment, colour, buyer] = await mfc.read(0, 1);
            assert.equal("C", helpers.toString(char));
            [char, attachment, colour, buyer] = await mfc.read(1, 1);
            assert.equal("D", helpers.toString(char));

        });
        it("can publish cyrillic", async () => {
            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});

            await mfc.publishBlock(0, 0, "Г В\nЯ Ж", "", "0xff0000", {from: secondAccount}); // red
            let [char, attachment, colour, buyer] = await mfc.read(0, 0);

            assert.equal("Г", helpers.toString(char));
            assert.equal("", attachment);
            assert.equal("0xff0000", colour);
            assert.equal(secondAccount, buyer);
            [char, attachment, colour, buyer] = await mfc.read(1, 0);
            assert.equal("В", helpers.toString(char));
            [char, attachment, colour, buyer] = await mfc.read(0, 1);
            assert.equal("Я", helpers.toString(char));
            [char, attachment, colour, buyer] = await mfc.read(1, 1);
            assert.equal("Ж", helpers.toString(char));

        });
        it("can publish 3-byte utf8", async () => {
            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});

            await mfc.publishBlock(0, 0, "€", "", "0xff0000", {from: secondAccount}); // red
            let [char, attachment, colour, buyer] = await mfc.read(0, 0);

            assert.equal("€", helpers.toString(char));
            assert.equal("", attachment);
            assert.equal("0xff0000", colour);
            assert.equal(secondAccount, buyer);
        });
        it("can publish emojis", async () => {
            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});

            await mfc.publishBlock(0, 0, "😁 😂\n😍 😝", "", "0xff0000", {from: secondAccount}); // red
            let [char, attachment, colour, buyer] = await mfc.read(0, 0);

            assert.equal("😁", helpers.toString(char));
            assert.equal("", attachment);
            assert.equal("0xff0000", colour);
            assert.equal(secondAccount, buyer);
            [char, attachment, colour, buyer] = await mfc.read(1, 0);
            assert.equal("😂", helpers.toString(char));
            [char, attachment, colour, buyer] = await mfc.read(0, 1);
            assert.equal("😍", helpers.toString(char));
            [char, attachment, colour, buyer] = await mfc.read(1, 1);
            assert.equal("😝", helpers.toString(char));

        });
        it("can publish malformated string", async() => {
            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});
            await mfc.publishBlock(0, 0, "A ", "", "0xff0000", {from: secondAccount}); // empty string at the end of the published string
            let [char, attachment, colour, buyer] = await mfc.read(0, 0);

            assert.equal("A", helpers.toString(char));
            [char, attachment, colour, buyer] = await mfc.read(1, 0);
            assert.equal("", helpers.toString(char));
        });
        it('can\'t publish two chars in a box', async() => {
            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});
            try {
                await mfc.publishBlock(0, 0, "AB C", "", "0xff0000", {from: secondAccount}); // Attempt to post 2 chars in the first box
                assert.fail();
            }catch(e){
                assert.ok(/revert/.test(e.message));
            }
            let [char, attachment, colour, buyer] = await mfc.read(0, 0);

            assert.equal("", helpers.toString(char));

        });
        it('can\'t publish two chars in a box using single publish method', async () => {
            await mfc.buy(0, 0, 2, 2, {from: secondAccount, value: 4 * FINNEY});
            try {
                await mfc.publish(0, 0, helpers.toHex("AB"), "", "0xff0000", {from: secondAccount}); // Attempt to post 2 chars in the first box
                assert.fail();
            } catch (e) {
                assert.ok(/revert/.test(e.message));
            }
            let [char, attachment, colour, buyer] = await mfc.read(0, 0);

            assert.equal("", helpers.toString(char));

        });
    });

    describe("Kill", () => {
        it("can be killed by owner", async () => {
            await mfc.kill({from: firstAccount});
            assert.ok(true);
        });
        it("can't be killed by another player", async () => {
            try{
                await mfc.kill({from: secondAccount});
                assert.fail();
            }catch (e){
                assert.ok(/revert/.test(e.message));
            }


        });
    });


});
