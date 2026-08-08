// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Monadopolis
 * @dev Smart Contract Monadopolis mengombinasikan ERC721 NFT Gedung Kota dan Sistem Voting Ujian Dadakan AI di Monad Testnet.
 */
contract Monadopolis is ERC721, Ownable {
    uint256 public nextTokenId = 1;
    uint256 public currentDisasterId = 0;

    struct Disaster {
        uint256 id;
        string title;
        bool isActive;
        bool isResolved;
        uint256[3] voteCounts; // 3 pilihan solusi (indeks 0, 1, 2)
        uint8 winningOption;
        uint256 createdAt;
    }

    // disasterId => Disaster
    mapping(uint256 => Disaster) public disasters;
    // disasterId => player address => hasVoted
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event BuildingMinted(address indexed player, uint256 indexed tokenId);
    event DisasterStarted(uint256 indexed disasterId, string title);
    event VoteCast(uint256 indexed disasterId, address indexed player, uint8 optionIndex);
    event DisasterResolved(uint256 indexed disasterId, uint8 winningOption, uint256 maxVotes);

    constructor() ERC721("Monadopolis City Building", "MPOL") Ownable(msg.sender) {
        // Auto-initialize Disaster #1 so on-chain voting works out of the box!
        currentDisasterId = 1;
        Disaster storage disaster = disasters[1];
        disaster.id = 1;
        disaster.title = "Badai Listrik AI Monadopolis";
        disaster.isActive = true;
        disaster.isResolved = false;
        disaster.createdAt = block.timestamp;
        emit DisasterStarted(1, disaster.title);
    }

    /**
     * @dev Mencetak NFT Gedung Permanen untuk pemain yang mencapai 100 token poin.
     */
    function mintBuilding(address player) external returns (uint256) {
        require(player != address(0), "Alamat pemain tidak valid");

        uint256 tokenId = nextTokenId++;
        _safeMint(player, tokenId);

        emit BuildingMinted(player, tokenId);
        return tokenId;
    }

    /**
     * @dev Memulai sesi ujian dadakan/bencana baru dari AI.
     */
    function startDisaster(string memory title) external returns (uint256) {
        currentDisasterId++;
        uint256 disasterId = currentDisasterId;

        Disaster storage disaster = disasters[disasterId];
        disaster.id = disasterId;
        disaster.title = title;
        disaster.isActive = true;
        disaster.isResolved = false;
        disaster.createdAt = block.timestamp;

        emit DisasterStarted(disasterId, title);
        return disasterId;
    }

    /**
     * @dev Memberikan suara voting solusi bencana. Satu wallet hanya bisa vote 1x per bencana.
     */
    function voteSolution(uint256 disasterId, uint8 optionIndex) external {
        // Auto-activate disaster 1 if not yet created on legacy instance
        if (disasterId == 1 && !disasters[1].isActive && !disasters[1].isResolved) {
            disasters[1].id = 1;
            disasters[1].title = "Badai Listrik AI Monadopolis";
            disasters[1].isActive = true;
        }

        Disaster storage disaster = disasters[disasterId];
        require(disaster.isActive, "Sesi bencana tidak aktif");
        require(!hasVoted[disasterId][msg.sender], "Anda sudah memberikan suara");
        require(optionIndex < 3, "Pilihan solusi harus 0, 1, atau 2");

        hasVoted[disasterId][msg.sender] = true;
        disaster.voteCounts[optionIndex]++;

        emit VoteCast(disasterId, msg.sender, optionIndex);
    }

    /**
     * @dev Menutup sesi voting bencana dan menentukan opsi terbanyak.
     */
    function resolveDisaster(uint256 disasterId) external returns (uint8 winningOption) {
        Disaster storage disaster = disasters[disasterId];
        require(disaster.isActive, "Sesi bencana tidak aktif");

        disaster.isActive = false;
        disaster.isResolved = true;

        uint256 maxVotes = 0;
        uint8 winner = 0;

        for (uint8 i = 0; i < 3; i++) {
            if (disaster.voteCounts[i] > maxVotes) {
                maxVotes = disaster.voteCounts[i];
                winner = i;
            }
        }

        disaster.winningOption = winner;
        emit DisasterResolved(disasterId, winner, maxVotes);
        return winner;
    }

    /**
     * @dev Mengambil rincian perolehan suara per opsi untuk bencana tertentu.
     */
    function getVoteCounts(uint256 disasterId) external view returns (uint256[3] memory) {
        return disasters[disasterId].voteCounts;
    }
}
