const Token = artifacts.require("WATT");
const WRStorage = artifacts.require("WorkRecordsStorage");

const OneToken = web3.toBigNumber(1).mul(10**18);
const hashes = [
    '0xf5f69112af86801565fed2cea7508e5e',
    '0x6d63bf5dcba233e43320180c54cf5850',
    '0x521dad65a6c5a67c9a688451d659ffc5'
];

contract("AddWorkRecord", function ([owner, user1, user2]) {

    let token;
    let wrStorage;

    before('Initializing contracts and token transfers', async function () {

        token = await Token.new();
        wrStorage = await WRStorage.new(token.address);

        await token.transfer(user1, OneToken);

    })
    it('Verifying setup', async function () {

        const user1Balance = await token.balanceOf(user1);
        const user2Balance = await token.balanceOf(user2);
        assert.equal(OneToken.toNumber(), user1Balance.toNumber());
        assert.equal(0, user2Balance.toNumber());

    });




    it('Member can add WorkRecord', async function () {

        try {
            await wrStorage.addWorkRecord(1, hashes[0], {from: user1});
        } catch (error) {
            assert.fail("Failed to protect from adding WorkRecord by user that don't have rights");
        }
    });
    it('Non-member will fail to add WorkRecord', async function () {

        try {
            await wrStorage.addWorkRecord(2, hashes[1], {from: user2})
        } catch (error) {
            return;
        }

        assert.fail("Failed to protect from adding WorkRecord by user that don't have rights");

    });




    it('Owner can add WorkRecord for member', async function () {

        try {
            await wrStorage.ownerAddWorkRecord(user1, 3, hashes[2], {from: owner});
        } catch (error) {
            assert.fail("Failed to protect from adding WorkRecord by user that don't have rights");
        }
    });
    it('Owner can\'t add WorkRecord for non-member', async function () {

        try {
            await wrStorage.ownerAddWorkRecord(user2, 4, hashes[0], {from: owner})
        } catch (error) {
            return;
        }

        assert.fail("Failed to protect from adding WorkRecord by user that don't have rights");

    });
    it('Non-owner can\'t use ownerOnly function', async function () {

        try {
            await wrStorage.ownerAddWorkRecord(user2, 4, hashes[0], {from: user1})
        } catch (error) {
            return;
        }

        assert.fail("Failed to protect from adding WorkRecord by user that don't have rights");

    });




    it('Verifying number of events', async function () {

        wrStorage.WorkRecord({}, { fromBlock: 0, toBlock: 'latest' }).get((error, results) => {
            if (error){
                assert.fail(error);
            }else{
                assert.equal(2, results.length);
            }
        });

    });
});