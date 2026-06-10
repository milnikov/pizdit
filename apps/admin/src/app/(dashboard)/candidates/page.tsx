import { getServiceClient } from "@pizdit/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CandidatesAdminPage() {
  const supabase = getServiceClient();
  const { data: candidates } = await supabase
    .from("candidates")
    .select("*, elections(name)")
    .order("full_name");

  return (
    <div>
      <h1 className="text-2xl font-bold">Candidates</h1>
      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="pb-2">Name</th>
            <th className="pb-2">Party</th>
            <th className="pb-2">Election</th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(candidates ?? []).map((c) => (
            <tr key={c.id} className="border-b border-slate-100">
              <td className="py-3 font-medium">{c.full_name}</td>
              <td className="py-3">
                {c.is_independent ? "Independent" : c.party_name}
              </td>
              <td className="py-3">
                {(c.elections as { name: string } | null)?.name ?? "—"}
              </td>
              <td className="py-3">
                <Link
                  href={`/api/admin/pipeline/ingest?candidateId=${c.id}`}
                  className="text-blue-600 underline"
                >
                  Ingest sources
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
