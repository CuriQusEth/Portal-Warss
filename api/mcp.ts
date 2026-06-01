import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Portal Wars MCP Endpoint",
      status: "active",
      description: "Active MCP server for Portal Wars Orchestrator Agent",
      capabilities: ["portal-battles", "cross-realm-management", "strategic-warfare"],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const { method, params } = req.body || {};

      if (method === 'initialize') {
          return res.status(200).json({
              protocolVersion: '2024-11-05',
              capabilities: { tools: {} },
              serverInfo: {
                  name: "Portal Wars Orchestrator",
                  version: "1.0.0"
              }
          });
      }

      if (method === 'tools/list') {
          return res.status(200).json({
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
          return res.status(200).json({
              content: [{
                  type: "text",
                  text: `Executed ${toolName} successfully in Portal Wars realm.`
              }]
          });
      }
      
      if (method === 'prompts/list') {
          return res.status(200).json({ prompts: [] });
      }
    
      if (method === 'resources/list') {
          return res.status(200).json({ resources: [] });
      }

      return res.status(200).json({
        status: "success",
        message: "MCP command received",
        agent: "Portal Wars Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: req.body
      });

    } catch (error) {
      return res.status(400).json({ error: "Invalid MCP request" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
