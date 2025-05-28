"use server";

import { tiktokAudioTranscript } from "@/trigger/tiktokAudioTranscript";
import { tasks } from "@trigger.dev/sdk/v3";

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
          concurrencyLimit: 2,
        },
      }
    );

    return handle
  } catch (error) {
    console.log(error);
  }
}
