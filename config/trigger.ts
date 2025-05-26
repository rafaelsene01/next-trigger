"use server";

import { configure } from "@trigger.dev/sdk/v3";

export function initTrigger() {
  configure({
    secretKey: process.env.TRIGGER_SECRET_KEY,
    baseURL: process.env.TRIGGER_API_URL,
  });
}
