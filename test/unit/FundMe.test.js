const { getNamedAccounts, deployments, ethers } = require("hardhat")

const { assert, expect } = require("chai")
const { develompentChains } = require("../../helper-hardhat-config")

!develompentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundme
          let deployer
          let MockV3Aggregator
          const sendValue = ethers.utils.parseEther("0.1")

          beforeEach(async function () {
              //const acounts = await ethers.getSigners()
              // const accountZero = accounts[0]
              //or
              //const{deployer}= await getnamedAccounts()
              //the above line is same as downline
              //const{deployer}= await getnamedAccounts()
              deployer = (await getNamedAccounts()).deployer
              // `fixture` will automatic run eveyrything in `deploy` folder.
              await deployments.fixture(["all"])
              //hardhat-deploy warps `ethers` in function called `getContract`
              fundme = await ethers.getContract("FundMe", deployer)
              MockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", async function () {
              it("sets the price feed address correct", async function () {
                  const reponse = await fundme.getPriceFeed()
                  //assert.equal(foo, 'bar', 'foo equal `bar`');
                  assert.equal(reponse, MockV3Aggregator.address)
              })
          })
          describe("fund", async function () {
              it("shall fail if there is no enougn eth", async function () {
                  //await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
                  await expect(fundme.fund()).to.be.revertedWith(
                      "not enough funds"
                  )
              })
              it("updated the amount in the data structure", async function () {
                  await fundme.fund({ value: sendValue }) // SendVAlue is "1" eth which is being sent to deployer account.
                  const response = await fundme.getAddresstoAmountfunded(
                      deployer
                  ) // now `deployer` has `1` eth.
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("adds funders to array", async function () {
                  await fundme.fund({ value: sendValue })
                  const funder = await fundme.getFunder(0) //`0` is the index and the address of `deployer`
                  assert.equal(funder, deployer)
              })
          })
          describe("withdrawl", function () {
              beforeEach(async function () {
                  await fundme.fund({ value: sendValue })
              })
              it(" withdrawl ETH from a single founder", async function () {
                  //arrange

                  //await ethers.provider.getbalance(FundMe.address)
                  //or we can also write `name of the contract` than `ethers` like below.
                  const startingFundMeBalance =
                      await fundme.provider.getBalance(fundme.address)
                  const staringDeployerBalance =
                      await fundme.provider.getBalance(deployer)
                  //act
                  const transactionResponse = await fundme.withdrawal()
                  const transactionReceipt = await transactionResponse.wait(1)
                  // we have checked `transReceipt` in `javascript debugger` and saw they are using gas.
                  //hence dereived `gasused` and `effectiveGasPrice` from their.
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endinFundMebalance = await fundme.provider.getBalance(
                      fundme.address
                  )
                  const endingDeployerBalance =
                      await fundme.provider.getBalance(deployer)
                  //assert
                  assert.equal(endinFundMebalance, 0)
                  assert.equal(
                      startingFundMeBalance.add(staringDeployerBalance),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })
              it("allows us to withdrawl with multiple s_funders", async function () {
                  //Arrange
                  const accounts = await ethers.getSigners()

                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundme.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }

                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundme.address)
                  const staringDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  //Act
                  const transactionResponse = await fundme.withdrawal()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } =
                      await transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  //assert
                  const endinFundMebalance = await ethers.provider.getBalance(
                      fundme.address
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  //assert
                  assert.equal(endinFundMebalance.toString(), 0)
                  assert.equal(
                      staringDeployerBalance.add(startingFundMeBalance),
                      endingDeployerBalance.add(gasCost).toString()
                  )

                  //make sure funders are reset
                  await expect(fundme.getFunder(0)).to.be.reverted

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await fundme.getAddresstoAmountfunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("allow only owner to withrdawl", async function () {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnectedContract = await fundme.connect(
                      attacker
                  )

                  await expect(
                      attackerConnectedContract.withdrawal()
                      //line by course
                      // ).to.be.revertedWith("FundMe_NotOwner")
                      //line changed since we using chai matchers not harahdt-waffle
                  ).to.be.revertedWithCustomError(fundme, "FundMe_NotOwner")
              })
              it("cheapwithdrawal function working....", async function () {
                  //Arrange
                  const accounts = await ethers.getSigners()

                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundme.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }

                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundme.address)
                  const staringDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  //Act
                  const transactionResponse = await fundme.CheaperWithdrawal()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } =
                      await transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  //assert
                  const endinFundMebalance = await ethers.provider.getBalance(
                      fundme.address
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  //assert
                  assert.equal(endinFundMebalance.toString(), 0)
                  assert.equal(
                      staringDeployerBalance.add(startingFundMeBalance),
                      endingDeployerBalance.add(gasCost).toString()
                  )

                  //make sure s_funders are reset
                  await expect(fundme.getFunder(0)).to.be.reverted

                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await fundme.getAddresstoAmountfunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
          })
      })
