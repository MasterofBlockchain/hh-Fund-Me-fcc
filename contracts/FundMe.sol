//SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "./PriceConvertor.sol";

//constant and immutable does get storegd in storage but contract itself.abi

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
    mapping(address => uint256) private s_AddrsstoFunds;
    address[] private s_funders;
    address private immutable i_owner;

    uint256 public constant MINIMUM_USD = 50 * 1e18;
    AggregatorV3Interface public s_priceFeed;

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
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
        //non 23600
        //immutable 21508
    }

    function fund() public payable {
        require(
            msg.value.GetConversionPrice(s_priceFeed) >= MINIMUM_USD,
            "not enough funds"
        );
        s_funders.push(msg.sender);
        s_AddrsstoFunds[msg.sender] += msg.value;
    }

    function withdrawal() public OnlyOwner {
        for (
            uint256 fundersIndex = 0;
            fundersIndex < s_funders.length;
            fundersIndex++
        ) {
            address funder = s_funders[fundersIndex];
            s_AddrsstoFunds[funder] = 0;
        }

        // reset the funders array.
        s_funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        //call vs delegatecall
        require(callSuccess, "not owner");
    }

    function CheapWithdrawal() public payable OnlyOwner {
        address[] memory funders = s_funders;
        //mapping cant be in memory
        for (
            uint256 fundersIndex = 0;
            fundersIndex < s_funders.length;
            fundersIndex++
        ) {
            address funder = s_funders[fundersIndex];
            s_AddrsstoFunds[funder] = 0;
        }

        s_funders = new address[](0);
        (bool Success, ) = i_owner.call{value: address(this).balance}("");
        require(Success);
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddresstoAmountfunded(address funder)
        public
        view
        returns (uint256)
    {
        return s_AddrsstoFunds[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed();
    }
}
