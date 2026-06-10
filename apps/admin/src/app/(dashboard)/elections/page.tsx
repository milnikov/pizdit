import { getServiceClient } from "@pizdit/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ElectionsAdminPage() {
  const supabase = getServiceClient();
  const { data: elections } = await supabase
    .from("elections")
    .select("*")
    .order("election_date");

  return (
    <div>
      <h1 className="text-2xl font-bold">Elections</h1>
      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="pb-2">Name</th>
            <th className="pb-2">Location</th>
            <th className="pb-2">Date</th>
            <th className="pb-2">Level</th>
          </tr>
        </thead>
        <tbody>
          {(elections ?? []).map((e) => (
            <tr key={e.id} className="border-b border-slate-100">
              <td className="py-3 font-medium">{e.name}</td>
              <td className="py-3">
                {[e.municipality_name, e.region_name, e.country_code]
                  .filter(Boolean)
                  .join(", ")}
              </td>
              <td className="py-3">{e.election_date}</td>
              <td className="py-3 capitalize">{e.election_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {(elections ?? []).length === 0 && (
        <p className="mt-4 text-slate-500">No elections. Run Supabase seed migration.</p>
      )}
    </div>
  );
}
