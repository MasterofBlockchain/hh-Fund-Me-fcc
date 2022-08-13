const { network } = require("hardhat")
const {
    develompentChains,
    INITIAL_ANSWER,
    DECIMALS,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    //if (develompentChain.includes(chainId == "31337")) {
    // if (chainId == "31337")
    if (develompentChains.includes(network.name)) {
        log("local network detecting..deployin mocks....")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("MOCKS DEPLOYED!")
        log("---------------------------------------")
    }
}
module.exports.tags = ["all", "mocks"]
