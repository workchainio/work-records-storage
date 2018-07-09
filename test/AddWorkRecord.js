const WorkToken = artifacts.require("WorkToken");
const WRStorage = artifacts.require("WorkRecordsStorage");

const OneToken = web3.toBigNumber(1).mul(10**18);
const Sha256 = [
    '0x7ea6f7c2709cdd0838909fef0fb1a9839477feca1cea344b3d710904ff29095f',
    '0x63e5dedd9326c390b9d1cb2336d8e5072733930e5c2a9a6495f5ae1aabac60e3',
    '0xbc52d6bfe3ac965e069109dbd7d15e0ccaaa55678f6e2a6664bee2edf8ae1b2b'
];

contract("AddWorkRecord", function ([owner, user1, user2]) {

    let workToken;
    let wrStorage;

    before('Initializing contracts and token transfers', async function () {

        workToken = await WorkToken.new();
        wrStorage = await WRStorage.new(workToken.address);

        await workToken.transfer(user1, OneToken);

    })
    it('Verifying setup', async function () {

        const user1Balance = await workToken.balanceOf(user1);
        const user2Balance = await workToken.balanceOf(user2);
        assert.equal(OneToken.toNumber(), user1Balance.toNumber());
        assert.equal(0, user2Balance.toNumber());

    });
    it('Testing if member can add WorkRecord', async function () {

        try {
            await wrStorage.addWorkRecord(1, Sha256[0], {from: user1});
        } catch (error) {
            assert.fail("Failed to protect from adding WorkRecord by user that don't have rights");
        }
    });
    it('Testing if non-member will fail in add WorkRecord', async function () {

        try {
            await wrStorage.addWorkRecord(2, Sha256[1], {from: user2})
        } catch (error) {
            return;
        }

        assert.fail("Failed to protect from adding WorkRecord by user that don't have rights");

    });
    it('Testing if owner can add WorkRecord for user1', async function () {

        try {
            await wrStorage.ownerAddWorkRecord(user1, 3, Sha256[2], {from: owner});
        } catch (error) {
            assert.fail("Failed to protect from adding WorkRecord by user that don't have rights");
        }
    });
    it('Testing if user1 can\'t use ownerOnly function', async function () {

        try {
            await wrStorage.ownerAddWorkRecord(user2, 4, Sha256[0], {from: user1})
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