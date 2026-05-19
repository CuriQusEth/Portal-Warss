# Portal Wars

Portal Wars is a fast-paced, strategic real-time portal combat web game. You play as a Portal Commander opening dimensional portals to summon units, launch surprise attacks, and dominate the battlefield against an enemy commander.

## Project Overview

- **App URL:** https://portal-warss.vercel.app/
- **Description:** A fast-paced, strategic real-time portal combat web game.
- **Capabilities:** portal-battles, cross-realm-management, strategic-warfare, multi-portal-orchestration, realm-defense, tactical-automation, mcp-command-execution
- **Network Support:** eip155:8453 (Base Mainnet)

## Tech Stack

- **Framework:** Next.js (App Router API routes) / React
- **Styling:** Tailwind CSS, Framer Motion
- **Game Engine:** Custom HTML5 Canvas rendering engine
- **Web3 Integrations:** Wagmi, Viem, SIWE
- **AI/Agent Standards:** ERC-8004 Trustless Agents, MCP (Model Context Protocol), ERC-8021 Attribution

## Model Context Protocol (MCP) Connection Guide

Portal Wars comes integrated with a dedicated **MCP API Endpoint** capable of executing contextual AI/Agent tools directly within the platform.

- **MCP Endpoint URL:** `https://portal-warss.vercel.app/api/mcp`
- **Protocol:** `MCP`
- **Supported Tools:** 
    - `get_race_status`: Get the latest racing status/parameters
    - `start_race`: Initialize a new race condition
    - `get_leaderboard`: Fetch the on-chain leaderboard data
    - `optimize_speed`: Strategically optimize speed handling
    - `get_track_info`: Returns metadata about the active track environments

Use standard MCP-compliant clients to interact with this endpoint remotely.

## Agent Registration Info

Portal Wars implements a public ERC-8004 compliant Agent Card to declare its Orchestrator presence.

- **Endpoint:** `https://portal-warss.vercel.app/.well-known/agent-card.json`
- **Agent Name:** Portal Wars Orchestrator
- **Status:** Active / Online
- **Agent API:** `https://portal-warss.vercel.app/api/agent`

## How To Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development environment:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000` to battle.
