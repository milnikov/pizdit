import { createClient } from "@/utils/supabase/server";

type Todo = {
  id: string | number;
  name: string;
};

export default async function TodosPage() {
  const supabase = await createClient();
  const { data: todos } = await supabase.from("todos").select("id, name");

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Todos</h1>
      <ul className="space-y-2">
        {(todos as Todo[] | null)?.map((todo) => (
          <li key={todo.id} className="rounded border border-slate-200 px-3 py-2">
            {todo.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
