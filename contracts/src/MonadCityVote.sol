// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title MonadCityVote
 * @dev Smart contract for AI Disaster On-Chain Mass Voting in Monad AI City Builder.
 */
contract MonadCityVote {
    struct DisasterSession {
        uint256 id;
        string crisisDescription;
        string[] options;
        uint256[] voteCounts;
        bool isActive;
        bool isResolved;
        uint8 winningOption;
        uint256 createdAt;
    }

    uint256 public nextSessionId = 1;
    address public admin;

    // sessionId => DisasterSession
    mapping(uint256 => DisasterSession) public sessions;
    // sessionId => player address => hasVoted
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    // sessionId => player address => votedOption
    mapping(uint256 => mapping(address => uint8)) public playerVotes;

    event SessionCreated(uint256 indexed sessionId, string crisisDescription);
    event VoteCast(uint256 indexed sessionId, address indexed player, uint8 optionIndex);
    event SessionResolved(uint256 indexed sessionId, uint8 winningOption, bool isSuccess);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createDisasterSession(
        string memory _crisisDescription,
        string[] memory _options
    ) external returns (uint256) {
        require(_options.length >= 2, "Must have at least 2 options");

        uint256 sessionId = nextSessionId++;
        DisasterSession storage session = sessions[sessionId];
        session.id = sessionId;
        session.crisisDescription = _crisisDescription;
        session.options = _options;
        session.voteCounts = new uint256[](_options.length);
        session.isActive = true;
        session.isResolved = false;
        session.createdAt = block.timestamp;

        emit SessionCreated(sessionId, _crisisDescription);
        return sessionId;
    }

    function voteSolution(uint256 _sessionId, uint8 _optionIndex) external {
        DisasterSession storage session = sessions[_sessionId];
        require(session.isActive, "Session is not active");
        require(!hasVoted[_sessionId][msg.sender], "Player has already voted");
        require(_optionIndex < session.options.length, "Invalid option index");

        hasVoted[_sessionId][msg.sender] = true;
        playerVotes[_sessionId][msg.sender] = _optionIndex;
        session.voteCounts[_optionIndex]++;

        emit VoteCast(_sessionId, msg.sender, _optionIndex);
    }

    function resolveDisasterSession(uint256 _sessionId, uint8 _correctOptionIndex) external {
        DisasterSession storage session = sessions[_sessionId];
        require(session.isActive, "Session is not active");
        require(_correctOptionIndex < session.options.length, "Invalid correct option index");

        session.isActive = false;
        session.isResolved = true;
        session.winningOption = _correctOptionIndex;

        // Check if majority vote matched the correct option
        uint8 majorityOption = 0;
        uint256 maxVotes = 0;
        for (uint8 i = 0; i < session.options.length; i++) {
            if (session.voteCounts[i] > maxVotes) {
                maxVotes = session.voteCounts[i];
                majorityOption = i;
            }
        }

        bool isSuccess = (majorityOption == _correctOptionIndex);
        emit SessionResolved(_sessionId, _correctOptionIndex, isSuccess);
    }

    function getSessionOptions(uint256 _sessionId) external view returns (string[] memory, uint256[] memory) {
        DisasterSession storage session = sessions[_sessionId];
        return (session.options, session.voteCounts);
    }
}
