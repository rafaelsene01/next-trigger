import { useRun } from "@trigger.dev/react-hooks";
import { tiktokAudioTranscript } from "@/trigger/tiktokAudioTranscript";

export function Transcript({
  runId,
  accessToken,
}: {
  runId: string;
  accessToken: string;
}) {
  const { run, error, isLoading } = useRun<typeof tiktokAudioTranscript>(
    runId,
    {
      accessToken,
      refreshInterval: 1000,
      baseURL: process.env.NEXT_PUBLIC_TRIGGER_API_URL,
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (run?.status === "COMPLETED") return <div>{run.output?.text}</div>;

  return <div>Run: {run.status}</div>;
}
