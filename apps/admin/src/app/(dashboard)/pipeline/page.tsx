import { getServiceClient } from "@pizdit/db";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const supabase = getServiceClient();
  const { data: runs } = await supabase
    .from("pipeline_runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="text-2xl font-bold">Pipeline Runs</h1>
      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="pb-2">Type</th>
            <th className="pb-2">Entity</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Started</th>
            <th className="pb-2">Error</th>
          </tr>
        </thead>
        <tbody>
          {(runs ?? []).map((run) => (
            <tr key={run.id} className="border-b border-slate-100">
              <td className="py-3">{run.pipeline_type}</td>
              <td className="py-3 font-mono text-xs">{run.entity_id}</td>
              <td className="py-3">
                <span
                  className={
                    run.status === "completed"
                      ? "text-green-600"
                      : run.status === "failed"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }
                >
                  {run.status}
                </span>
              </td>
              <td className="py-3 text-xs">
                {run.started_at
                  ? new Date(run.started_at).toLocaleString()
                  : "—"}
              </td>
              <td className="py-3 text-xs text-red-500">
                {run.error_message ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(runs ?? []).length === 0 && (
        <p className="mt-4 text-slate-500">No pipeline runs yet.</p>
      )}
    </div>
  );
}
