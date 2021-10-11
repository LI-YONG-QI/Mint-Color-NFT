const { assert } = require("chai");

const Color = artifacts.require("./Color.sol");

require("chai")
    .use(require("chai-as-promised"))
    .should()

contract("Color", (accounts) =>{
    let contract;

    before(async() => {
        contract = await Color.deployed();
    })

    describe("deployment", async() => {
        it("depolys successfully", async() =>{
            const address = contract.address;
            //console.log(address);
            assert.notEqual(address, "");
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
            assert.notEqual(address, "0x0");
        })

        it('has a name', async() =>{
            const name = await contract.name();
            assert.equal(name, "color");
        })

        it('has a symbol', async() =>{
            const symbol = await contract.symbol();
            assert.equal(symbol, "COLOR");
        })
    })
    describe("minting", async() =>{

        it("creates a new token", async() => {
            const result = await contract.mint("#dfa926");
            const totalSupply = await contract.totalSupply()
            
            //Success
            assert.equal(totalSupply, 1);
            const event = result.logs[0].args;
            assert.equal(event.tokenId.toNumber(), 1, "id is correct");
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', "from is correct");
            assert.equal(event.to, accounts[0], "to is correct");

            //Failure : Cannot mint same color twice
            await contract.mint("#dfa926").should.be.rejected;
        })
    })

    describe("indexing", async() => {
        it("list colors", async() => {
            //Mint 3 more tokens
            await contract.mint("#2d0300");
            await contract.mint("#FFFFFF");
            await contract.mint("#000000");
            const totalSupply = await contract.totalSupply();
            assert.equal(totalSupply, 4);

            let color;
            let result = [];

            for(var i = 1 ; i <= totalSupply; i++){
                color = await contract.colors(i-1);
                result.push(color);
            }

            let expected = ["#dfa926", "#2d0300", "#FFFFFF", "#000000"];
            assert.equal(result.join(','), expected.join(','));
            /*assert.equal(result[0], "#dfa926");
            assert.equal(result[1], "#2d0300");
            assert.equal(result[2], "#FFFFFF");
            assert.equal(result[3], "#000000");*/
            
        })
    })
})