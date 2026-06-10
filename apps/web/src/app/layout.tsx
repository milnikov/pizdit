import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pizdit — Check what politicians are saying",
  description:
    "Evidence-based political claim analysis. See what is on your ballot before you vote.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-bold text-slate-900">
              Pizdit
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/countries" className="text-slate-600 hover:text-slate-900">
                Coverage
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          Civic information tool. Not voting advice. Verify official election info with authorities.
        </footer>
      </body>
    </html>
  );
}
