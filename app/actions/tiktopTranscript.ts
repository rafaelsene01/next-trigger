"use server";

import { tiktokAudioTranscript } from "@/trigger/tiktokAudioTranscript";
import { tasks, runs } from "@trigger.dev/sdk/v3";

export async function tiktokFormTranscript({
  url,
  id,
}: {
  url: string;
  id: string;
}) {
  try {
    const handle = await tasks.trigger<typeof tiktokAudioTranscript>(
      "tiktokAudioTranscript",
      { id, url },
      {
        concurrencyKey: id, // Permite criar filas exclusivas
        // Posso usar o ID do usuario, criando assim filas exclusivas para o mesmo.
        // Campo abaixo respeita o processamento com base na Fila(Grupo) em que elas estão, nesta caso o ID do cliente
        queue: {
          // Levando em conta o Cliente, aqui posso customizar a quantidade de processos que sera executada na fila.
          name: "free-user", // + Math.random(),
          concurrencyLimit: 1,
        },
      }
    );

    let run = await runs.retrieve(handle.id);

    while (run.status !== "COMPLETED") {
      if (run.status === "FAILED") throw new Error();
      run = await await runs.retrieve(handle.id);
      await new Promise((r) => setTimeout(() => r("done"), 2000));
    }

    const { output } = run;
    return output;
  } catch (error) {
    console.log(error);
  }
}
