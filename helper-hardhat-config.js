const networkconfig = {
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },

    80001: {
        name: "polygon",
        // mumabi mainnet//ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
        ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
    },
}
//const develompentChain = ["31337"]
const develompentChains = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000

module.exports = {
    networkconfig,
    develompentChains,
    DECIMALS,
    INITIAL_ANSWER,
}
