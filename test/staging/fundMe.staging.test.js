const { getNamedAccounts, ethers, network } = require("hardhat")
const { develompentChains } = require("../../helper-hardhat-config")
const { assert } = "chai"

develompentChains.includes(network.name)
    ? describe.skip
    : describe("fundme", async function () {
          let FundMe
          let deployer
          const sendValue = ethers.utils.parseEther("0.1")
          beforEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              FundMe = await ethers.getContract("FundMe", deployer)
          })
          it("allow pople to fund and withdrawl", async function () {
              await FundMe.fund({ Value: sendValue })
              const tx = await FundMe.withdrawal()
              await tx.wait(1)
              const endingBalance = await FundMe.provider.getBalance(
                  FundMe.address
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
