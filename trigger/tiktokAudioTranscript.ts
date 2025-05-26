import { task, wait } from "@trigger.dev/sdk/v3";
import OpenAI from "openai";

export const tiktokAudioTranscript = task({
  id: "tiktokAudioTranscript",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  retry: { maxAttempts: 0 },
  machine: { preset: "micro" },
  run: async ({ id, url }: { id: string; url: string }) => {
    // await wait.for({ seconds: 10 });
    const audioRes = await fetch(url);
    if (!audioRes.ok) throw new Error("Falha ao baixar o audio");

    const arrayBuffer = await audioRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const apiKey = process.env.OPENAPI_KEY;

    const openai = new OpenAI({ apiKey });

    const file = new File([buffer], "audio.mp3", { type: "audio/mpeg" });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
    });

    const { text, words } = transcription;

    return { text, words };
  },
});
