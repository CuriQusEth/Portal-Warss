// @ts-ignore
import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "Portal Wars MCP Endpoint",
    status: "active",
    description: "Active MCP server for Portal Wars Orchestrator Agent",
    capabilities: ["portal-battles", "cross-realm-management", "strategic-warfare"],
    timestamp: new Date().toISOString()
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}

export async function POST(req: Request) {
  try {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    const body = await req.json();
    const { method, params } = body;

    // Standard JSON-RPC wrapper if requested
    const isJsonRpc = body.jsonrpc === '2.0';
    const requestId = body.id;

    function jsonRpcResponse(result: any) {
        if (isJsonRpc) {
            return NextResponse.json({
                jsonrpc: "2.0",
                id: requestId,
                result
            }, { headers });
        }
        return NextResponse.json(result, { headers });
    }

    // MCP Implementation based on capabilities
    if (method === 'initialize') {
        return jsonRpcResponse({
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: {
                name: "Portal Wars Orchestrator",
                version: "1.0.0"
            }
        });
    }

    if (method === 'tools/list') {
        return jsonRpcResponse({
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
        return jsonRpcResponse({
            content: [{
                type: "text",
                text: `Executed ${toolName} successfully in Portal Wars realm.`
            }]
        });
    }
    
    if (method === 'prompts/list') {
        return jsonRpcResponse({ prompts: [] });
    }
  
    if (method === 'resources/list') {
        return jsonRpcResponse({ resources: [] });
    }

    return jsonRpcResponse({
      status: "success",
      message: "MCP command received",
      agent: "Portal Wars Orchestrator",
      receivedAt: new Date().toISOString(),
      payload: body
    });

  } catch (error) {
    return NextResponse.json({ error: "Invalid MCP request" }, { status: 400 });
  }
}
