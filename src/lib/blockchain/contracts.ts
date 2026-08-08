export const MONADOPOLIS_CONTRACT_ADDRESS = "0xf09E0f2f019ab9E829307362D823F3a0b585001f" as `0x${string}`;

export const MONADOPOLIS_ABI = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "mintBuilding",
    stateMutability: "nonpayable",
    inputs: [{ name: "player", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "startDisaster",
    stateMutability: "nonpayable",
    inputs: [{ name: "title", type: "string" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "voteSolution",
    stateMutability: "nonpayable",
    inputs: [
      { name: "disasterId", type: "uint256" },
      { name: "optionIndex", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "resolveDisaster",
    stateMutability: "nonpayable",
    inputs: [{ name: "disasterId", type: "uint256" }],
    outputs: [{ name: "winningOption", type: "uint8" }],
  },
  {
    type: "function",
    name: "getVoteCounts",
    stateMutability: "view",
    inputs: [{ name: "disasterId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256[3]" }],
  },
  {
    type: "function",
    name: "hasVoted",
    stateMutability: "view",
    inputs: [
      { name: "disasterId", type: "uint256" },
      { name: "player", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "BuildingMinted",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
  {
    type: "event",
    name: "DisasterStarted",
    inputs: [
      { name: "disasterId", type: "uint256", indexed: true },
      { name: "title", type: "string", indexed: false },
    ],
  },
  {
    type: "event",
    name: "VoteCast",
    inputs: [
      { name: "disasterId", type: "uint256", indexed: true },
      { name: "player", type: "address", indexed: true },
      { name: "optionIndex", type: "uint8", indexed: false },
    ],
  },
  {
    type: "event",
    name: "DisasterResolved",
    inputs: [
      { name: "disasterId", type: "uint256", indexed: true },
      { name: "winningOption", type: "uint8", indexed: false },
      { name: "maxVotes", type: "uint256", indexed: false },
    ],
  },
] as const;
