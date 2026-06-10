import { getServiceClient } from "@pizdit/db";
import { ClaimRatingBadge } from "@pizdit/ui";
import type { ClaimRating } from "@pizdit/core";

export const dynamic = "force-dynamic";

export default async function ClaimsAdminPage() {
  const supabase = getServiceClient();

  const { data: claims } = await supabase
    .from("political_claims")
    .select("*, candidates(full_name), claim_checks(id, final_rating, is_published, audit_status)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold">Claims</h1>
      <div className="mt-6 space-y-4">
        {(claims ?? []).map((claim) => {
          const checks = (claim.claim_checks as Array<{
            id: string;
            final_rating: string;
            is_published: boolean;
            audit_status: string;
          }>) ?? [];
          const published = checks.find((c) => c.is_published);

          return (
            <div
              key={claim.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <p className="text-sm font-medium text-slate-900">
                &ldquo;{claim.claim_text}&rdquo;
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {(claim.candidates as { full_name: string } | null)?.full_name} ·{" "}
                {claim.claim_type}
              </p>
              <div className="mt-3 flex items-center gap-3">
                {published ? (
                  <ClaimRatingBadge rating={published.final_rating as ClaimRating} />
                ) : (
                  <span className="text-xs text-slate-400">Not published</span>
                )}
                <form action={`/api/admin/pipeline/claim-check`} method="POST">
                  <input type="hidden" name="claimId" value={claim.id} />
                  <button
                    type="submit"
                    className="text-xs text-blue-600 underline"
                  >
                    Run claim check
                  </button>
                </form>
                {published && (
                  <form action={`/api/admin/claim-checks/toggle`} method="POST">
                    <input type="hidden" name="claimCheckId" value={published.id} />
                    <input type="hidden" name="publish" value="false" />
                    <button type="submit" className="text-xs text-red-600 underline">
                      Unpublish
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
