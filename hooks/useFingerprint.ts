import FingerprintJS from "@fingerprintjs/fingerprintjs";

export async function getFingerprintJS(): Promise<{ visitorId: string }> {
    const fp = await FingerprintJS.load();
    const { visitorId } = await fp.get();
    return { visitorId }
}
