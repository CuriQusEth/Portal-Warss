import { encodeFunctionData } from 'viem';

export interface AgentContext {
    agentAddress: string;
    ownerAddress: string;
    permissions: string[];
}

export function createTrustlessAgent(ownerAddress: string): AgentContext {
    // In a real implementation this would generate or deploy an ERC-8004 contract
    return {
        agentAddress: ownerAddress, // Fallback to owner for demo
        ownerAddress,
        permissions: ['submitScore', 'claimRewards', 'sayGM']
    };
}

export function signAgentAction(context: AgentContext, action: string, data: any) {
    // Mock signing for the agent
    return {
        action,
        data,
        signedBy: context.agentAddress,
        timestamp: Date.now()
    };
}
