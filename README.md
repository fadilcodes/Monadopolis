# 🏢 MONADOPOLIS - Monad AI City Builder

> **An 8-bit AI-themed Web3 Multiplayer City Builder on Monad Testnet**

![Monadopolis Banner](https://img.shields.io/badge/Blockchain-Monad%20Testnet-8B5CF6?style=for-the-badge&logo=ethereum)
![AI Engine](https://img.shields.io/badge/AI-Disabled%20for%20Hackathon-6B7280?style=for-the-badge)
![Realtime DB](https://img.shields.io/badge/Database-Supabase%20Realtime-3ECF8E?style=for-the-badge&logo=supabase)
![Design System](https://img.shields.io/badge/Aesthetics-8--bit%20Retro%20Pixel-FFD700?style=for-the-badge)

---

## 🌟 Overview

**MONADOPOLIS** is a retro 8-bit Web3 multiplayer city builder powered by **Monad Testnet** and **Supabase Realtime**.

> [!IMPORTANT]
> AI-powered interactions are disabled for this hackathon deployment. The app does not require or use an AI API key; AI controls only show the in-app hackathon notice.

Players can connect a Web3 wallet, choose one of three competing city factions, explore the shared multiplayer skyline, and mint an eligible completed building as an **ERC-721 Building NFT** on Monad Testnet. The AI quiz and AI disaster controls remain visible as hackathon-only UI, but clicking them only opens the notice and never calls an AI service or starts an AI-related transaction.

---

## 🚀 Key Features

- 🤖 **AI Quiz Demo Controls**: Retained for the hackathon presentation, but every control opens the notice instead of calling Gemini.
- 🏙 **Multiplayer Real-Time City Skyline**: Powered by Supabase WebSockets. Building heights across all active network players update live side-by-side without page refreshes.
- 🛡 **Faction System & Global Leaderboard**: Compete under **Neon Vanguard** ⚡, **Cyber Syndicate** 🌐, or **Terra Alliance** 🌿. Real-time leaderboards rank both Top Players and Top Factions.
- ⚡ **AI Disaster Demo Control**: Retained visually, but it opens the notice and cannot initiate a vote or AI request.
- 💎 **ERC-721 Building NFT Minting**: Reaching 100 token points completes building construction and unlocks permanent on-chain NFT minting on Monad Testnet.

---

## 🏛 Hybrid Architecture (Off-Chain Speed + On-Chain Security)

The diagram below describes the original prototype architecture. In this hackathon deployment, the Gemini connection and all AI-triggered flows are disabled at both the UI and API-route layers.

```
                          ┌───────────────────────────┐
                          │   Google Gemini AI API    │
                          │ (Generates AI Trivia/Trap)│
                          └─────────────┬─────────────┘
                                        │
                                        ▼
┌───────────────────────────┐    ┌─────────────┐    ┌───────────────────────────┐
│   Monad Testnet (On-Chain)│ ◄──┤ Next.js App ├──► │ Supabase Realtime (WS)    │
│  - ERC-721 NFT Minting    │    │ (Frontend)  │    │  - Realtime Skyline Sync  │
│  - Disaster Mass Voting   │    └─────────────┘    │  - Faction & Leaderboard  │
└───────────────────────────┘                       └───────────────────────────┘
```

> [!NOTE]
> **Why Hybrid?**
> - **Off-Chain (Supabase Realtime)**: Handles real-time multiplayer building height synchronization and faction leaderboard calculations.
> - **On-Chain (Monad Testnet)**: The active UI retains wallet connection and eligible ERC-721 Building NFT minting. AI disaster voting is not reachable from the deployed UI.

---

## 📜 Smart Contract Deployment

The deployed **`Monadopolis.sol`** contract contains ERC-721 Building NFT minting and the prototype disaster-voting capability. The hackathon UI does not expose the AI disaster voting flow.

| Parameter | Value |
| :--- | :--- |
| **Contract Name** | `Monadopolis` |
| **Contract Address** | `0xf09E0f2f019ab9E829307362D823F3a0b585001f` |
| **Network** | Monad Testnet |
| **Chain ID** | `10143` |
| **RPC Endpoint** | `https://testnet-rpc.monad.xyz` |
| **Monad Explorer** | [https://testnet.monadscan.com/address/0xf09E0f2f019ab9E829307362D823F3a0b585001f](https://testnet.monadscan.com/address/0xf09E0f2f019ab9E829307362D823F3a0b585001f) |

---

## 🛠 Tech Stack

- **Frontend & App Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & Aesthetics**: Custom 8-Bit Retro Pixel Art Design System (Vanilla CSS & Tailwind CSS)
- **AI Integration**: Disabled for the hackathon deployment; no AI SDK or API key is used
- **Off-Chain Database & Realtime**: `@supabase/supabase-js` (Supabase Realtime WebSockets & Postgres Triggers)
- **Web3 & Wallet Integration**: Wagmi, Viem, MetaMask, Monad Testnet RPC
- **Smart Contract Environment**: Solidity `0.8.28`, Hardhat, OpenZeppelin Contracts (`ERC721`, `Ownable`)

---

## 🛠 Getting Started & Local Setup

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/MONADOPOLIS.git
cd MONADOPOLIS
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Realtime Database
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Monad Testnet RPC & Deployer Wallet
NEXT_PUBLIC_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
PRIVATE_KEY=your_deployer_private_key_without_0x
```

### 3. Setup Supabase Database Schema

Run the SQL migration script located in [`supabase/schema.sql`](supabase/schema.sql) in your **Supabase Dashboard -> SQL Editor**. This creates tables for `factions`, `players`, `city_state`, `quiz_history`, and enables Supabase Realtime publications.

### 4. Compile & Deploy Smart Contract (Optional)

```bash
# Compile Solidity contracts
npx hardhat compile

# Deploy to Monad Testnet
npx hardhat run scripts/deploy.js --network monadTestnet
```

### 5. Run Local Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser with MetaMask connected to **Monad Testnet**.

---

## 🕹 Gameplay Guide

1. **Connect Web3 Wallet**: Click `CONNECT WALLET` and switch network to Monad Testnet.
2. **Onboarding**: Set your 8-bit **Nickname/Username** and choose a **Faction** (*Neon Vanguard*, *Cyber Syndicate*, or *Terra Alliance*).
3. **AI Controls**: Click an AI quiz or disaster control to view the hackathon-only notice; no AI request is sent.
4. **Explore Web3 Features**: View the real-time skyline and use the non-AI wallet/NFT interactions that remain available.
5. **Mint NFT**: Upon reaching 100 token points, click **`MINT NFT ON-CHAIN`** to permanently record your completed building on Monad Testnet!

---

## 📄 License

Distributed under the MIT License. Built with ❤️ for the Monad Ecosystem Hackathon.
