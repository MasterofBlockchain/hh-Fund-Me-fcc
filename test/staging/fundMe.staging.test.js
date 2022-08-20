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
              //added by discord
              //   const tx = await FundMe.fund({ value: sendValue })
              //   await tx.wait(1)
              //mine lines
              //await FundMe.withdrawal()
              //added by github
              const tx = await FundMe.withdrawal()
              await tx.wait(1)
              const endingBalance = await FundMe.provider.getBalance(
                  FundMe.address
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })

//   it("allow people to fund and withdraw", async function () {
//     await FundMe.fund({ value: sendValue })
//     const tx = await FundMe.withdrawal()
//     await tx.wait(1)
//     const endingBalance = await FundMe.provider.getBalance(
//         FundMe.address
//     )
//     assert.equal(endingBalance.toString(), "0")
// })
