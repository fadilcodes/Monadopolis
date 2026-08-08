# 🏢 MONADOPOLIS - Monad AI City Builder

> **An 8-bit AI-powered Web3 Multiplayer City Builder on Monad Testnet**

![Monadopolis Banner](https://img.shields.io/badge/Blockchain-Monad%20Testnet-8B5CF6?style=for-the-badge&logo=ethereum)
![AI Engine](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google)
![Realtime DB](https://img.shields.io/badge/Database-Supabase%20Realtime-3ECF8E?style=for-the-badge&logo=supabase)
![Design System](https://img.shields.io/badge/Aesthetics-8--bit%20Retro%20Pixel-FFD700?style=for-the-badge)

---

## 🌟 Overview

**MONADOPOLIS** is a retro 8-bit retro Web3 multiplayer city builder powered by **Monad Testnet**, **Google Gemini AI**, and **Supabase Realtime**.

Players connect their Web3 wallet, choose one of three competing city factions, and answer dynamic AI-generated trivia quizzes. Every correct answer builds higher pixelated skyscraper floors in real-time across a shared multiplayer city skyline. When players face AI-triggered city disaster crises, the entire community engages in **on-chain mass voting** on Monad Testnet. Once a player achieves a perfect score of 100 token points, they permanently mint their completed city building as an **ERC-721 Building NFT** on Monad Testnet!

---

## 🚀 Key Features

- 🤖 **Google Gemini AI Trivia Quizzes**: Generates dynamic, context-aware Web3 and architecture trivia questions with instant explanations. (+5 points for correct answers, -2 points for wrong answers).
- 🏙 **Multiplayer Real-Time City Skyline**: Powered by Supabase WebSockets. Building heights across all active network players update live side-by-side without page refreshes.
- 🛡 **Faction System & Global Leaderboard**: Compete under **Neon Vanguard** ⚡, **Cyber Syndicate** 🌐, or **Terra Alliance** 🌿. Real-time leaderboards rank both Top Players and Top Factions.
- ⚡ **On-Chain AI Disaster Mass Voting**: AI triggers dynamic city disaster pop-quiz emergencies. Players participate in on-chain voting via MetaMask transactions on Monad Testnet to resolve city crises.
- 💎 **ERC-721 Building NFT Minting**: Reaching 100 token points completes building construction and unlocks permanent on-chain NFT minting on Monad Testnet.

---

## 🏛 Hybrid Architecture (Off-Chain Speed + On-Chain Security)

MONADOPOLIS utilizes a high-performance **Hybrid Architecture** balancing fast, zero-gas micro-interactions with immutable on-chain governance:

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
> - **Off-Chain (Supabase Realtime)**: Handles instant quiz scoring, real-time multiplayer building height synchronization, and faction leaderboard calculations—eliminating high transaction friction and gas fees during daily gameplay.
> - **On-Chain (Monad Testnet)**: Executed for critical milestone events: community disaster governance voting and permanent ERC-721 Building NFT minting.

---

## 📜 Smart Contract Deployment

The core smart contract **`Monadopolis.sol`** combines ERC-721 Building NFT minting and AI disaster voting, deployed natively to **Monad Testnet**.

| Parameter | Value |
| :--- | :--- |
| **Contract Name** | `Monadopolis` |
| **Contract Address** | `0x06654EeABE960552c9B9E639FaA71de2EeAdE8e4` |
| **Network** | Monad Testnet |
| **Chain ID** | `10143` |
| **RPC Endpoint** | `https://testnet-rpc.monad.xyz` |
| **Monad Explorer** | [https://testnet.monadscan.com/address/0x06654EeABE960552c9B9E639FaA71de2EeAdE8e4](https://testnet.monadscan.com/address/0x06654EeABE960552c9B9E639FaA71de2EeAdE8e4) |

---

## 🛠 Tech Stack

- **Frontend & App Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & Aesthetics**: Custom 8-Bit Retro Pixel Art Design System (Vanilla CSS & Tailwind CSS)
- **AI Integration**: `@google/generative-ai` (Google Gemini API)
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
# Google Gemini AI Key
GEMINI_API_KEY=your_gemini_api_key

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
3. **Build Skyline**: Answer Gemini AI trivia questions (+5 points per correct answer). Watch your building height grow in real-time alongside other players!
4. **On-Chain AI Disaster Voting**: Participate in community crisis mitigation by voting on-chain via MetaMask transactions.
5. **Mint NFT**: Upon reaching 100 token points, click **`MINT NFT ON-CHAIN`** to permanently record your completed building on Monad Testnet!

---

## 📄 License

Distributed under the MIT License. Built with ❤️ for the Monad Ecosystem Hackathon.
