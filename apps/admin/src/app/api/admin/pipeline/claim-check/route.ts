import { runClaimCheckPipeline } from "@pizdit/ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let claimId: string | undefined;

  const contentType = request.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const body = (await request.json()) as { claimId?: string };
    claimId = body.claimId;
  } else {
    const form = await request.formData();
    claimId = form.get("claimId") as string;
  }

  if (!claimId) {
    return NextResponse.json({ error: "claimId required" }, { status: 400 });
  }

  const result = await runClaimCheckPipeline(claimId);

  if (request.headers.get("accept")?.includes("text/html")) {
    return NextResponse.redirect(new URL("/claims", request.url));
  }

  return NextResponse.json(result);
}
