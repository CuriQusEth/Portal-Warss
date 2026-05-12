# Portal Wars

**Portal Wars** is a fast-paced, strategic real-time portal combat web game. You play as a Portal Commander opening dimensional portals to summon units, launch surprise attacks, and dominate the battlefield against an enemy commander.

## Features

- **Strategic Real-time Combat**: Tap to open portals as units automatically pour through.
- **Dimensional Warfare**: Defend your portals while destroying the enemy's.
- **Procedural Waves**: Survive incoming waves of enemies that steadily increase in difficulty.
- **On-chain Attributed Warfare (ERC-8021)**: Ensure every battle score is immutably written to the blockchain.
- **Command & Orchestrate (ERC-8004)**: Integrates modern Agent-to-Agent standards to orchestrate battles and manage multi-portal strategies.

## Technologies Used

- **Frontend Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Framer Motion
- **Game Engine**: Custom HTML5 Canvas rendering for 60fps fast-paced battles
- **Web3 Ecosystem**: Wagmi, Viem
- **Smart Standard Integrations**: ERC-8021 Attribution, ERC-8004 Trustless Agents

## Technical Information

### Model Context Protocol (MCP) and Agents
The game is equipped with an AI Agent orchestrator for cross-realm operations and strategic automated warfare. A public `.well-known/agent-card.json` file dictates properties, services, and core agent capabilities.

### Backend Architecture
This application utilizes a bundled Express backend alongside the Vite development environment for seamless hybrid full-stack routing, necessary for serving dynamic API endpoints such as `/api/mcp` and `/api/agent`.

## Development

Install dependencies and start the application:

```bash
npm install
npm run dev
```

Build the application:
```bash
npm run build
npm start
```
