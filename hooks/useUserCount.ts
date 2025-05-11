'use server';

const onlineUsers = new Map<string, number>();

export async function heartbeat(userId: string) {
    onlineUsers.set(userId, Date.now());
}

export async function getOnlineUsers(): Promise<number> {
    const now = Date.now();
    const activeUsers = [...onlineUsers.values()].filter(
        (ts) => now - ts < 10000
    );
    return activeUsers.length;
}
