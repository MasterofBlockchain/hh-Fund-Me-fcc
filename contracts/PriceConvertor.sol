//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// address- 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e

library PriceConvertor {
    function getVersion() internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        );
        return priceFeed.version();
    }

    function getPrice(AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price * 1e10);
    }

    function GetConversionPrice(
        uint256 EthAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 EthPrice = getPrice(priceFeed);
        uint256 EthPriceinUsd = (EthAmount * EthPrice) / 1e18;
        return EthPriceinUsd;
    }
}
