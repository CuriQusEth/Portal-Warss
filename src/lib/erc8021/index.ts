export const ATTRIBUTION_CODE = "bc_80ls1o4i";

export function withAttribution(calldata: string): string {
    // Basic demonstration of ERC-8021 calldata attribution
    // Real implementation would append the attribution code according to the EIP specification
    const hexCode = Array.from(new TextEncoder().encode(ATTRIBUTION_CODE))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    return `${calldata}${hexCode}`;
}

export function buildAttributionData(address: string, score: number) {
    return {
        builder: ATTRIBUTION_CODE,
        user: address,
        score,
        timestamp: Date.now()
    }
}

export function generateSIWEMessage(address: string, score: number, wave: number): string {
    return `PORTAL WARS: Record the battle results on-chain.\n\nCommander: ${address}\nHighest Wave: ${wave}\nScore: ${score}\nAttribution: ${ATTRIBUTION_CODE}`;
}
