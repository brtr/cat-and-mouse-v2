// SPDX-License-Identifier: MIT LICENSE

pragma solidity ^0.8.0;

import "./ERC20.sol";
import "./Ownable.sol";
import "./IRandomizer.sol";

contract Randomizer is IRandomizer, ERC20 {
    constructor() ERC20("Randomizer", "Randomizer") {}

    function commitId() public view override returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            tx.origin,
            blockhash(block.number - 1),
            block.timestamp
        )));
    }

    function getCommitRandom(uint256 id) public view override returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            tx.origin,
            blockhash(block.number - 1),
            block.timestamp,
            id
        )));
    }

    function random() public view override returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            tx.origin,
            blockhash(block.number - 1),
            block.timestamp
        )));
    }

    function sRandom(uint256 tokenId) public view override returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            tx.origin,
            blockhash(block.number - 1),
            block.timestamp,
            tokenId
        )));
    }
}
