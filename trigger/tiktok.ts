/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger, task } from "@trigger.dev/sdk/v3";
import { Downloader } from "@tobyg74/tiktok-api-dl";
import { tiktokVideoDownload } from "./tiktokVideo";
import { nanoid } from 'nanoid'
import { tiktokAudioDownload } from "./tiktokAudio";

export const tiktokDownload = task({
    id: "tiktok-download",
    // Set an optional maxDuration to prevent tasks from running indefinitely
    maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
    retry: { maxAttempts: 0 },
    run: async ({ url }: { url: string }, { ctx }) => {
        logger.log("URL", { url });
        logger.log("CTX", { ctx });

        const { result, status } = await Downloader<'v3'>(url)

        logger.log("Video", { status, result });

        if (status !== "success")
            throw new Error('Não foi possível obter informações do vídeo.');

        const { music, video }: any = result

        if (!video || !video?.playAddr?.length)
            throw new Error('Não foi possível obter o link do vídeo.');

        if (!music || !music?.playUrl?.length)
            throw new Error('Não foi possível obter o link do audio.');

        const videoUrl = video?.playAddr[0]
        const audioUrl = music?.playUrl[0]

        const savePath = `TriggerDev/${nanoid()}`
        await tiktokVideoDownload.triggerAndWait({ url: videoUrl, savePath })
        await tiktokAudioDownload.triggerAndWait({ url: audioUrl, savePath })

        return {
            videoPath: savePath + 'mp4',
            audioPath: savePath + 'mp3',
        }
    },
});