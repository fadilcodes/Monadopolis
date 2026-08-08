// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title MonadBuildingNFT
 * @dev ERC-721 smart contract for permanent city building NFT minting on Monad Testnet.
 */
contract MonadBuildingNFT {
    string public name = "Monadopolis City Building";
    string public symbol = "MCB";

    uint256 public nextTokenId = 1;
    address public owner;

    // tokenId => recipient address
    mapping(uint256 => address) private _owners;
    // address => token count
    mapping(address => uint256) private _balances;
    // tokenId => metadata URI
    mapping(uint256 => string) private _tokenURIs;
    // tokenId => building score (e.g. 100)
    mapping(uint256 => uint256) public buildingScores;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event BuildingMinted(address indexed recipient, uint256 indexed tokenId, string tokenURI, uint256 buildingScore);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function mintBuildingNFT(
        address recipient,
        string memory _tokenURI,
        uint256 _buildingScore
    ) external returns (uint256) {
        require(recipient != address(0), "Invalid recipient address");
        require(_buildingScore >= 100, "Building score must be at least 100 to mint NFT");

        uint256 tokenId = nextTokenId++;
        _owners[tokenId] = recipient;
        _balances[recipient] += 1;
        _tokenURIs[tokenId] = _tokenURI;
        buildingScores[tokenId] = _buildingScore;

        emit Transfer(address(0), recipient, tokenId);
        emit BuildingMinted(recipient, tokenId, _tokenURI, _buildingScore);

        return tokenId;
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        address tokenOwner = _owners[tokenId];
        require(tokenOwner != address(0), "Token does not exist");
        return tokenOwner;
    }

    function balanceOf(address account) external view returns (uint256) {
        require(account != address(0), "Invalid account");
        return _balances[account];
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        return _tokenURIs[tokenId];
    }
}
