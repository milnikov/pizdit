import { getServiceClient } from "@pizdit/db";

export const dynamic = "force-dynamic";

export default async function PromptsPage() {
  const supabase = getServiceClient();
  const { data: prompts } = await supabase
    .from("prompt_versions")
    .select("*")
    .order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold">Prompt Versions</h1>
      <div className="mt-6 space-y-4">
        {(prompts ?? []).map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">
                {p.name} <span className="text-slate-400">v{p.version}</span>
              </h2>
              <span className="text-xs text-slate-400">
                {new Date(p.created_at).toLocaleDateString()}
              </span>
            </div>
            <pre className="mt-3 max-h-32 overflow-auto rounded bg-slate-50 p-3 text-xs text-slate-700">
              {p.prompt_text}
            </pre>
          </div>
        ))}
      </div>
      {(prompts ?? []).length === 0 && (
        <p className="mt-4 text-slate-500">No prompts configured. Run seed migration.</p>
      )}
    </div>
  );
}
