export function decodeJWT(token: string | undefined): { header: any; payload: any; } | null {
    if(!token) return null;

    try {
        const [headerEncoded, payloadEncoded] = token.split('.').slice(0, 2);
    
        const header = JSON.parse(atob(headerEncoded));
        const payload = JSON.parse(atob(payloadEncoded));
    
        return { header, payload };
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
}