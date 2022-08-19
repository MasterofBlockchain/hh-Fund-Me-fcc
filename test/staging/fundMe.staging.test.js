const { getNamedAccounts, ethers, network } = require("hardhat")
const { assert } = require("chai")

const { develompentChains } = require("../../helper-hardhat-config")

develompentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let FundMe
          let deployer
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              FundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allow people to fund and withdraw", async function () {
              await FundMe.fund({ value: sendValue })
              await FundMe.withdrawal()
              const endingBalance = await FundMe.provider.getBalance(
                  FundMe.address
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
