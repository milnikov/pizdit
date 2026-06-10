import Link from "next/link";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/elections", label: "Elections" },
  { href: "/candidates", label: "Candidates" },
  { href: "/claims", label: "Claims" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/token-usage", label: "Token Usage" },
  { href: "/prompts", label: "Prompts" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-slate-200 bg-white p-4">
        <h1 className="mb-6 text-lg font-bold">Pizdit Admin</h1>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
