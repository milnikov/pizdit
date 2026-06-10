import { getServiceClient } from "@pizdit/db";

export const dynamic = "force-dynamic";

export default async function TokenUsagePage() {
  const supabase = getServiceClient();
  const { data: logs } = await supabase
    .from("token_usage_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const totalInput = (logs ?? []).reduce((s, l) => s + (l.input_tokens ?? 0), 0);
  const totalOutput = (logs ?? []).reduce((s, l) => s + (l.output_tokens ?? 0), 0);
  const totalCost = (logs ?? []).reduce(
    (s, l) => s + Number(l.estimated_cost_usd ?? 0),
    0,
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Token Usage</h1>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold">{totalInput.toLocaleString()}</p>
          <p className="text-sm text-slate-500">Input tokens</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold">{totalOutput.toLocaleString()}</p>
          <p className="text-sm text-slate-500">Output tokens</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold">${totalCost.toFixed(4)}</p>
          <p className="text-sm text-slate-500">Estimated cost</p>
        </div>
      </div>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="pb-2">Model</th>
            <th className="pb-2">Entity</th>
            <th className="pb-2">Input</th>
            <th className="pb-2">Output</th>
            <th className="pb-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {(logs ?? []).map((log) => (
            <tr key={log.id} className="border-b border-slate-100">
              <td className="py-2">{log.model_name}</td>
              <td className="py-2 font-mono text-xs">{log.entity_id}</td>
              <td className="py-2">{log.input_tokens}</td>
              <td className="py-2">{log.output_tokens}</td>
              <td className="py-2 text-xs">
                {new Date(log.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
