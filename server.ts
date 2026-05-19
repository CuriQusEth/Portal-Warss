import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // API Route: MCP
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Portal Wars MCP Endpoint",
      status: "active",
      description: "Active MCP server for Portal Wars Orchestrator Agent",
      capabilities: ["portal-battles", "cross-realm-management", "strategic-warfare"],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const { method, params } = req.body;

      if (method === 'initialize') {
          return res.json({
              protocolVersion: '2024-11-05',
              capabilities: { tools: {} },
              serverInfo: {
                  name: "Portal Wars Orchestrator",
                  version: "1.0.0"
              }
          });
      }
  
      if (method === 'tools/list') {
          return res.json({
              tools: [
                  {
                      name: "get_race_status",
                      description: "Get the latest racing status/parameters",
                      inputSchema: { type: "object", properties: {} }
                  },
                  {
                      name: "start_race",
                      description: "Initialize a new race condition",
                      inputSchema: { type: "object", properties: {} }
                  },
                  {
                      name: "get_leaderboard",
                      description: "Fetch the on-chain leaderboard data",
                      inputSchema: { type: "object", properties: {} }
                  },
                  {
                      name: "optimize_speed",
                      description: "Strategically optimize speed handling",
                      inputSchema: { type: "object", properties: {} }
                  },
                  {
                      name: "get_track_info",
                      description: "Returns metadata about the active track environments",
                      inputSchema: { type: "object", properties: {} }
                  }
              ]
          });
      }
  
      if (method === 'tools/call') {
          const toolName = params?.name;
          return res.json({
              content: [{
                  type: "text",
                  text: `Executed ${toolName} successfully in Portal Wars realm.`
              }]
          });
      }
      
      if (method === 'prompts/list') {
          return res.json({ prompts: [] });
      }
    
      if (method === 'resources/list') {
          return res.json({ resources: [] });
      }

      res.json({
        status: "success",
        message: "MCP command received",
        agent: "Portal Wars Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: req.body
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid MCP request" });
    }
  });

  // API Route: Agent
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Portal Wars Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Portal Wars",
      version: "1.0.0"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
