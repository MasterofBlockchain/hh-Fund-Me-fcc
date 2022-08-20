//Istwaytowrite function// function deployFunc(hre) {
//     hre.getNamedAccounts
//     hre.deployments}
//     module.exports.default = deployFunc

//2nd way for unmaned function// module.exports = async (hre)=> {}

//2nd way to write// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre}
const { network } = require("hardhat")
const {
    networkconfig,
    develompentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

// const helperConfig = require("../helper-hardhat-config")
// const networkconfig = helperConfig.networkconfig
//3rd way while using synthtic sugar
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress
    if (develompentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkconfig[chainId]["ethUsdPriceFeed"]
    }
    const args = [ethUsdPriceFeedAddress]
    const FundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //put pricefeed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !develompentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(FundMe.address, args)
    }
    log("--------------------------------------------------")
}
module.exports.tags = ["all", "FundMe"]
