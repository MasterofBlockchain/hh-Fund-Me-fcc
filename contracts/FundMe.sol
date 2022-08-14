//SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "./PriceConvertor.sol";

//gas 958055// const 935561
//transaction cost 833,091 // const 813,531

error FundMe_NotOwner();

/**@title A crowd funding contract
 * @author Rob
 * @notice the Contract is for demo
 * @dev This Implements price feeds as our library
 
 */

contract FundMe {
    //type declaration
    using PriceConvertor for uint256;

    //state variable
    mapping(address => uint256) public AddrsstoFunds;
    address[] public funders;
    address public immutable i_owner;

    uint256 public constant MINIMUM_USD = 50 * 1e18;
    AggregatorV3Interface public priceFeed;

    //function order
    ////constructor
    //// receive
    ////fallback
    ////externa;
    ////public
    ////internal
    ////private
    ////view,pure

    modifier OnlyOwner() {
        //require(msg.sender ==i_owner, "not owner");
        if (msg.sender != i_owner) {
            revert FundMe_NotOwner();
        }
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
        //non 23600
        //immutable 21508
    }

    function fund() public payable {
        require(
            msg.value.GetConversionPrice(priceFeed) >= MINIMUM_USD,
            "not enough funds"
        );
        funders.push(msg.sender);
        AddrsstoFunds[msg.sender] += msg.value;
    }

    function withdrawal() public OnlyOwner {
        (bool sent, ) = payable(msg.sender).call{value: address(this).balance}(
            ""
        );
        require(sent, "not owner");

        for (
            uint256 fundersIndex = 0;
            fundersIndex > funders.length;
            fundersIndex++
        ) {
            address funder = funders[fundersIndex];
            AddrsstoFunds[funder] = 0;
            funders = new address[](0);
        }
    }
}
