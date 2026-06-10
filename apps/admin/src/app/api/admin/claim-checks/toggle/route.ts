import { getServiceClient } from "@pizdit/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const claimCheckId = form.get("claimCheckId") as string;
  const publish = form.get("publish") === "true";

  if (!claimCheckId) {
    return NextResponse.json({ error: "claimCheckId required" }, { status: 400 });
  }

  const supabase = getServiceClient();

  const { data: existing } = await supabase
    .from("claim_checks")
    .select("*")
    .eq("id", claimCheckId)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Claim check not found" }, { status: 404 });
  }

  await supabase
    .from("claim_checks")
    .update({ is_published: publish })
    .eq("id", claimCheckId);

  await supabase.from("manual_overrides").insert({
    entity_type: "claim_check",
    entity_id: claimCheckId,
    previous_value: { is_published: existing.is_published },
    new_value: { is_published: publish },
    reason: "Admin manual publish toggle",
    reviewer_id: "admin",
  });

  return NextResponse.redirect(new URL("/claims", request.url));
}
