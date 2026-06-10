"use client";

import { useState } from "react";
import { cn } from "./utils";

export function AddressInput({
  onSubmit,
  loading,
  className,
}: {
  onSubmit: (address: string) => void;
  loading?: boolean;
  className?: string;
}) {
  const [address, setAddress] = useState("");

  return (
    <form
      className={cn("flex flex-col gap-3", className)}
      onSubmit={(e) => {
        e.preventDefault();
        if (address.trim()) onSubmit(address.trim());
      }}
    >
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter your address"
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !address.trim()}
        className="rounded-lg bg-slate-900 px-6 py-3 text-base font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {loading ? "Finding elections..." : "Find my elections"}
      </button>
    </form>
  );
}
