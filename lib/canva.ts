/**
 * Canva Connect API - Autofill integration
 *
 * To use this:
 * 1. Create a Brand Template in Canva (requires Canva for Teams)
 * 2. Add autofill text fields matching the field names in payload.ts
 * 3. Get your template ID from the Canva URL
 * 4. Set CANVA_ACCESS_TOKEN in .env.local (obtained via OAuth)
 * 5. Set CANVA_TEMPLATE_ID in .env.local
 *
 * OAuth flow: https://www.canva.com/developers/docs/connect/oauth/
 */

const CANVA_API = "https://api.canva.com/rest/v1";

export interface CanvaAutofillJob {
  id: string;
  status: "pending" | "success" | "failed";
  result?: {
    design: { id: string; urls: { edit_url: string; view_url: string } };
  };
  error?: { message: string };
}

export async function createAutofillJob(
  payload: Record<string, unknown>,
  accessToken: string
): Promise<{ jobId: string } | { error: string }> {
  try {
    const res = await fetch(`${CANVA_API}/autofills`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { error: json.message ?? "Canva API error" };
    return { jobId: json.job?.id ?? json.autofill_job?.id ?? json.id };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function pollAutofillJob(
  jobId: string,
  accessToken: string
): Promise<CanvaAutofillJob> {
  const res = await fetch(`${CANVA_API}/autofills/${jobId}`, {
    headers: { "Authorization": `Bearer ${accessToken}` },
  });
  const json = await res.json();
  return json.job ?? json;
}

/** Poll until done (max 30 seconds) */
export async function waitForAutofill(jobId: string, accessToken: string): Promise<CanvaAutofillJob> {
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const job = await pollAutofillJob(jobId, accessToken);
    if (job.status === "success" || job.status === "failed") return job;
  }
  return { id: jobId, status: "failed", error: { message: "Timeout" } };
}
