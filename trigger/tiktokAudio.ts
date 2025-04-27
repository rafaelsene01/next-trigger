import { task } from "@trigger.dev/sdk/v3";
import { Buffer } from "buffer";
import { Readable } from "stream";

import { synologyUpload } from "@/lib/synology";

export const tiktokAudioDownload = task({
    id: "tiktokAudio-download",
    // Set an optional maxDuration to prevent tasks from running indefinitely
    maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
    retry: { maxAttempts: 0 },
    machine: { preset: "micro" },
    run: async ({ url, savePath }: { url: string, savePath: string }) => {
        const audioRes = await fetch(url);
        if (!audioRes.ok) throw new Error('Falha ao baixar o audio');

        const arrayBuffer = await audioRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const stream = Readable.from(buffer);

        await synologyUpload(stream, savePath + '.mp3')
    },
});