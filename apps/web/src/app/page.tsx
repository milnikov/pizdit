"use client";

import { AddressInput } from "@pizdit/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddressSubmit(address: string) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Could not find elections for this address.");
        return;
      }

      if (data.elections?.length === 1) {
        router.push(`/elections/${data.elections[0].id}`);
      } else if (data.elections?.length > 1) {
        router.push(
          `/countries?country=${data.countryCode}&region=${encodeURIComponent(data.regionName ?? "")}&municipality=${encodeURIComponent(data.municipalityName ?? "")}`,
        );
      } else {
        setError("No upcoming elections found for this address. Try manual selection.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Pizdit?
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Check what politicians are saying before you vote.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-1 text-base font-medium text-slate-900">
          Enter your address to see what is on your ballot.
        </h2>
        <p className="mb-6 text-sm text-slate-500">No account needed.</p>

        <AddressInput onSubmit={handleAddressSubmit} loading={loading} />

        {error && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-500">
            Or{" "}
            <a href="/countries" className="font-medium text-slate-900 underline">
              select your country manually
            </a>
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">
        We use your address only to find your election district.
      </p>
    </div>
  );
}
