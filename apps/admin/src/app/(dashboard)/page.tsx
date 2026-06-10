import { getServiceClient } from "@pizdit/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = getServiceClient();

  const [
    { count: electionsCount },
    { count: candidatesCount },
    { count: claimsCount },
    { count: publishedChecks },
    { count: pipelineRuns },
  ] = await Promise.all([
    supabase.from("elections").select("*", { count: "exact", head: true }),
    supabase.from("candidates").select("*", { count: "exact", head: true }),
    supabase.from("political_claims").select("*", { count: "exact", head: true }),
    supabase
      .from("claim_checks")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.from("pipeline_runs").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Elections", value: electionsCount ?? 0, href: "/elections" },
    { label: "Candidates", value: candidatesCount ?? 0, href: "/candidates" },
    { label: "Claims", value: claimsCount ?? 0, href: "/claims" },
    {
      label: "Published checks",
      value: publishedChecks ?? 0,
      href: "/claims",
    },
    { label: "Pipeline runs", value: pipelineRuns ?? 0, href: "/pipeline" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Manage elections, candidates, claims, and AI pipeline.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-slate-200 bg-white p-6 hover:border-slate-400"
          >
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
