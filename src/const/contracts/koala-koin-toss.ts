/**
 * Originally, the agent was going to have additional scope and be able to play
 * on-chain games on Abstract. This was removed to focus purely on trading.
 * Keeping this here if we want to revisit adding this functionality.
 */

export const KOALA_KOIN_TOSS_CONTRACT_ADDRESS =
  //   chain === abstractTestnet
  // ? "0x325c6E0C3477cD96a272b638bB3653cAeDB38a40"
  "0xcf161fac7074f678a390ee27a559e7053c183694";

export const KOALA_KOIN_TOSS_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_owner", type: "address" },
      { internalType: "address", name: "_foundation", type: "address" },
      { internalType: "address", name: "_koalaPoint", type: "address" },
      { internalType: "address", name: "_weth", type: "address" },
      { internalType: "address", name: "_vrf", type: "address" },
      { internalType: "uint256", name: "_foundationFee", type: "uint256" },
      { internalType: "uint256", name: "_poolEdge", type: "uint256" },
      { internalType: "uint256", name: "_maxRewardPercent", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bool", name: "isEnabled", type: "bool" },
      {
        indexed: false,
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountPerToss",
        type: "uint256",
      },
    ],
    name: "BonusSettingsUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BonusTokensAwarded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "EtherPurged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newFee",
        type: "uint256",
      },
    ],
    name: "FoundationFeeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "numCoins",
        type: "uint8",
      },
      { indexed: false, internalType: "uint8", name: "minHits", type: "uint8" },
    ],
    name: "GameCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
    ],
    name: "GameOptionUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldPercent",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newPercent",
        type: "uint256",
      },
    ],
    name: "MaxRewardPercentUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldEdge",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newEdge",
        type: "uint256",
      },
    ],
    name: "PoolEdgeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ticker",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "PrizePoolCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PrizePoolDeposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "poolId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PrizePoolWithdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "betAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feeAmount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "TossCommitted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "betAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "threshold",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tossResult",
        type: "uint256",
      },
      { indexed: false, internalType: "bool", name: "didWin", type: "bool" },
      {
        indexed: false,
        internalType: "uint256",
        name: "payout",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "TossRevealed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldVRF",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newVRF",
        type: "address",
      },
    ],
    name: "VRFChanged",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint8", name: "_numCoins", type: "uint8" },
      { internalType: "uint8", name: "_minHits", type: "uint8" },
      { internalType: "uint256", name: "_minBet", type: "uint256" },
      { internalType: "uint256", name: "_winChance", type: "uint256" },
      { internalType: "uint256", name: "_basePayout", type: "uint256" },
      { internalType: "uint256", name: "_prizePoolId", type: "uint256" },
    ],
    name: "addGameOption",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_ticker", type: "string" },
      { internalType: "address", name: "_tokenAddress", type: "address" },
    ],
    name: "addPrizePool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "bonusAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bonusPrizePoolId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_gameId", type: "uint256" },
      { internalType: "uint256", name: "_betAmount", type: "uint256" },
    ],
    name: "canPlaceBet",
    outputs: [
      { internalType: "bool", name: "canBet", type: "bool" },
      { internalType: "string", name: "reason", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_poolId", type: "uint256" },
      { internalType: "uint256", name: "depositAmount", type: "uint256" },
    ],
    name: "depositPrizePool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "foundationAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "foundationFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gameCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "gameOptions",
    outputs: [
      { internalType: "uint256", name: "gameId", type: "uint256" },
      { internalType: "uint8", name: "numCoins", type: "uint8" },
      { internalType: "uint8", name: "minHits", type: "uint8" },
      { internalType: "uint256", name: "minBet", type: "uint256" },
      { internalType: "uint256", name: "winChance", type: "uint256" },
      { internalType: "uint256", name: "basePayout", type: "uint256" },
      { internalType: "bool", name: "isActive", type: "bool" },
      { internalType: "uint256", name: "prizePoolId", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_gameId", type: "uint256" }],
    name: "getBetLimits",
    outputs: [
      { internalType: "uint256", name: "minBet", type: "uint256" },
      { internalType: "uint256", name: "maxBet", type: "uint256" },
      { internalType: "string", name: "reason", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_gameId", type: "uint256" },
      { internalType: "uint256", name: "_betAmount", type: "uint256" },
    ],
    name: "getPayout",
    outputs: [
      { internalType: "uint256", name: "winChance", type: "uint256" },
      { internalType: "uint256", name: "netBetAmount", type: "uint256" },
      { internalType: "uint256", name: "potentialPayout", type: "uint256" },
      { internalType: "uint256", name: "feeAmount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isBonusEnabled",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "koalaPoint",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_gameId", type: "uint256" },
      { internalType: "uint256", name: "betAmount", type: "uint256" },
    ],
    name: "koin_toss",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_gameId", type: "uint256" }],
    name: "koin_toss_eth",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "maxRewardPercent",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ownerAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolEdge",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "prizePoolCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "prizePools",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "string", name: "ticker", type: "string" },
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "uint256", name: "balance", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "purgeEther",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_poolId", type: "uint256" }],
    name: "purgePrizePool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "requestId", type: "uint256" },
      { internalType: "uint256", name: "randomNumber", type: "uint256" },
    ],
    name: "randomNumberCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_feeIn8decimals", type: "uint256" },
    ],
    name: "setFoundationFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_percentIn8decimals", type: "uint256" },
    ],
    name: "setMaxRewardPercent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_edgeIn8decimals", type: "uint256" },
    ],
    name: "setPoolEdge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_newVRF", type: "address" }],
    name: "setVRFAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "tossRequests",
    outputs: [
      { internalType: "uint256", name: "gameId", type: "uint256" },
      { internalType: "uint256", name: "betAmount", type: "uint256" },
      { internalType: "address", name: "player", type: "address" },
      { internalType: "bool", name: "processed", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bool", name: "_isEnabled", type: "bool" },
      { internalType: "uint256", name: "_poolId", type: "uint256" },
      { internalType: "uint256", name: "_amountPerToss", type: "uint256" },
    ],
    name: "updateBonusSettings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_gameId", type: "uint256" },
      { internalType: "uint8", name: "_numCoins", type: "uint8" },
      { internalType: "uint8", name: "_minHits", type: "uint8" },
      { internalType: "uint256", name: "_minBet", type: "uint256" },
      { internalType: "uint256", name: "_winChance", type: "uint256" },
      { internalType: "uint256", name: "_basePayout", type: "uint256" },
      { internalType: "bool", name: "_isActive", type: "bool" },
      { internalType: "uint256", name: "_prizePoolId", type: "uint256" },
    ],
    name: "updateGameOption",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "vrfAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "vrfSystem",
    outputs: [
      { internalType: "contract IVRFSystem", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "weth",
    outputs: [{ internalType: "contract IWETH", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_poolId", type: "uint256" },
      { internalType: "uint256", name: "withdrawAmount", type: "uint256" },
    ],
    name: "withdrawPrizePool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];
