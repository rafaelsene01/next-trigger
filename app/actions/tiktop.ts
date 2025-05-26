"use server";

import { Downloader } from "@tobyg74/tiktok-api-dl";

export async function tiktokForm({ url }: { url: string }) {
  try {
    const { result, status } = await Downloader<"v3">(url);

    const { music }: any = result;

    const urlMusic = music?.playUrl[0];

    return {
      status,
      url,
      urlMusic,
    };
  } catch (error) {
    console.log(error);
  }
}
