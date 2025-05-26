"use server";

import { Downloader } from "@tobyg74/tiktok-api-dl";

export async function tiktokForm({ url }: { url: string }) {
  try {
    const { result, status }: any = await Downloader<"v3">(url);

    const urlMusic = result?.music?.playUrl?.at(0);

    return {
      status,
      url,
      urlMusic,
    };
  } catch (error) {
    console.log(error);
  }
}
