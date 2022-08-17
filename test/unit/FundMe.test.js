const { getNamedAccounts, deployments, ethers } = require("hardhat")

const { assert, expect } = require("chai")
describe("FundMe", function () {
    let fundme
    let deployer
    let MockV3Aggregator
    const sendValue = ethers.utils.parseEther("1")

    beforeEach(async function () {
        //const{deployer}= await getnamedAccounts()
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundme = await ethers.getContract("FundMe", deployer)
        MockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor", async function () {
        it("sets the price feed address correct", async function () {
            const reponse = await fundme.priceFeed()
            //assert.equal(foo, 'bar', 'foo equal `bar`');
            assert.equal(reponse, MockV3Aggregator.address)
        })
    })
    describe("fund", async function () {
        it("shall fail if there is no enougn eth", async function () {
            //await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
            await expect(fundme.fund()).to.be.revertedWith("not enough funds")
        })
        it("updated the amount in the data structure", async function () {
            await fundme.fund({ value: sendValue })
            const response = await fundme.AddrsstoFunds(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("adds funders to array", async function () {
            await fundme.fund({ value: sendValue })
            const funder = await fundme.funders(0)
            assert.equal(funder, deployer)
        })
    })
    describe("withdrawl", function () {
        beforeEach(async function () {
            await fundme.fund({ value: sendValue })
        })
        it(" withdrawl ETH from a single founder", async function () {
            //arrange
            const startingFundMeBalance = await fundme.provider.getBalance(
                fundme.address
            )
            const staringDeployerBalance = await fundme.provider.getBalance(
                deployer
            )
            //act
            const transactionResponse = await fundme.withdrawal()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endinFundMebalance = await fundme.provider.getBalance(
                fundme.address
            )
            const endingDeployerBalance = await fundme.provider.getBalance(
                deployer
            )
            //assert
            assert.equal(endinFundMebalance, 0)
            assert.equal(
                startingFundMeBalance.add(staringDeployerBalance),
                endingDeployerBalance.add(gasCost).toString()
            )
        })
        it.only("allows us to withdrawl with multiple funders", async function () {
            //Arrange
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundme.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }
            const startingFundMeBalance = await fundme.provider.getBalance(
                fundme.address
            )
            const staringDeployerBalance = await fundme.provider.getBalance(
                deployer
            )
            //Act
            const transactionResponse = await fundme.withdrawal()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)
            //assert
            const endinFundMebalance = await fundme.provider.getBalance(
                fundme.address
            )
            const endingDeployerBalance = await fundme.provider.getBalance(
                deployer
            )
            //assert
            assert.equal(endinFundMebalance, 0)
            assert.equal(
                startingFundMeBalance.add(staringDeployerBalance),
                endingDeployerBalance.add(gasCost).toString()
            )
            //make sure funders are reset
            
            // Make a getter for storage variables
            await expect(fundMe.getFunder(0)).to.be.reverted

            for (i = 1; i < 6; i++) {
                assert.equal(await fundme.AddrsstoFunds(accounts[i].address), 0)
            }
        })
    })
})
