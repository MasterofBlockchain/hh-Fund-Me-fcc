const { getNamedAccounts, ethers, deployments, network } = require("hardhat")
const { develompentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")

!develompentChains.includes(network.name)
    ? describe.skip
    : describe("fundme", function () {
          let deployer
          let FundMe
          let MockV3Aggregator
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              //const acounts = await ethers.getSigners()
              // const accountZero = accounts[0]
              //or
              //const{deployer}= await getnamedAccounts()
              //the above line is same as downline
              //const{deployer}= await getnamedAccounts()
              //the above line is same as downline
              deployer = (await getNamedAccounts()).deployer
              // `fixture` will automatic run eveyrything in `deploy` folder.
              await deployments.fixture(["all"])
              //hardhat-deploy warps `ethers` in function called `getContract`
              FundMe = await ethers.getContract("FundMe", deployer)

              MockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", async function () {
              it("sets the aggregator address correctly", async function () {
                  const response = await FundMe.getPriceFeed()
                  //assert.equal(foo, 'bar', 'foo equal `bar`');
                  assert.equal(response, MockV3Aggregator.address)
              })
          })
          describe("fund", async function () {
              it("failed if you dont fund enough ethers", async function () {
                  // await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
                  await expect(FundMe.fund()).to.be.revertedWith(
                      "not enough funds"
                  )
              })

              it("update the amount in the data structure", async function () {
                  await FundMe.fund({ value: sendValue }) // SendVAlue is "1" eth which is being sent to deployer account.
                  const response = await FundMe.getAddresstoAmountfunded(
                      deployer
                  ) // now `deployer` has `1` eth.
                  //assert.equal(foo, 'bar', 'foo equal `bar`');
                  assert.equal(response.toString(), sendValue.toString())
              })

              it("adds funders to funder array", async function () {
                  await FundMe.fund({ value: sendValue })
                  const funder = await FundMe.getFunder(0) //`0` is the index and the address of `deployer`
              })

              it("updated the amount in the data structure", async function () {
                  await FundMe.fund({ value: sendValue }) // SendVAlue is "1" eth which is being sent to deployer account.
                  const response = await FundMe.getAddresstoAmountfunded(
                      deployer
                  ) // now `deployer` has `1` eth.
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("adds funders to array", async function () {
                  await FundMe.fund({ value: sendValue })
                  const funder = await FundMe.getFunder(0) //`0` is the index and the address of `deployer`
                  assert.equal(funder, deployer)
              })
          })

          describe("withdrawal", async function () {
              beforeEach(async function () {
                  await FundMe.fund({ value: sendValue })
              })
              it("can withdraw eth from a single funder", async function () {
                  //arrange

                  //await ethers.provider.getbalance(FundMe.address)
                  //or we can also write `name of the contract` than `ethers` like below.
                  const startingFUNDMEbalance =
                      await FundMe.provider.getBalance(FundMe.address)
                  const StartingDeployerBalance =
                      await FundMe.provider.getBalance(deployer)
                  //act
                  const transactionResponse = await FundMe.withdrawal()
                  const transactionReceipt = await transactionResponse.wait(1)
                  // we have checked `transReceipt` in `javascript debugger` and saw they are using gas.
                  //hence dereived `gasused` and `effectiveGasPrice` from their.
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  //act
                  const EndingFundMeBalance = await FundMe.provider.getBalance(
                      FundMe.address
                  )
                  const EndingDeployerBalance =
                      await FundMe.provider.getBalance(deployer)
                  //assert
                  assert.equal(EndingFundMeBalance, 0)

                  assert.equal(
                      startingFUNDMEbalance.add(StartingDeployerBalance),
                      EndingDeployerBalance.add(gasCost).toString()
                  )
              })
              it("allow us to withdrawl from multiple fudners", async function () {
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const FundmeaccountConect = await FundMe.connect(
                          accounts[i]
                      )
                      await FundmeaccountConect.fund({ value: sendValue })
                  }
                  const startingFUNDMEbalance =
                      await FundMe.provider.getBalance(FundMe.address)
                  const StartingDeployerBalance =
                      await FundMe.provider.getBalance(deployer)
                  //act
                  const transactionResponse = await FundMe.withdrawal()
                  const transReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFUNDMEbalance = await FundMe.provider.getBalance(
                      FundMe.address
                  )
                  const EndingDeployerBalance =
                      await FundMe.provider.getBalance(deployer)
                  //assert

                  assert.equal(endingFUNDMEbalance, 0)

                  assert.equal(
                      startingFUNDMEbalance.add(StartingDeployerBalance),
                      EndingDeployerBalance.add(gasCost).toString()
                  )
                  //make sure funders array is reset properly
                  await expect(FundMe.getFunder(0)).to.be.reverted
                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await FundMe.getAddresstoAmountfunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("only allow to withdral to the owner", async function () {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnctedContract = await FundMe.connect(
                      attacker
                  )
                  await expect(
                      attackerConnctedContract.withdrawal()
                  ).to.be.revertedWith("FundMe_NotOwner")
              })
          })
      })
