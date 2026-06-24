import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest } from "next/server";

export async function getDB(request?: NextRequest) {
  try {
    if (request) {
      const { env } = await getCloudflareContext({ request });
      if (env.DB) return env.DB;
    }
    // Fallback for non-request contexts
    const { env } = await getCloudflareContext({ 
      request: new Request('https://placeholder') 
    });
    return env.DB;
  } catch {
    return null;
  }
}
