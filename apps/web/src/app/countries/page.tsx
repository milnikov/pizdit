import { getCountries } from "@pizdit/db";
import { CountryCoverageBadge } from "@pizdit/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CountriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    country?: string;
    region?: string;
    municipality?: string;
  }>;
}) {
  const params = await searchParams;
  let countries: Awaited<ReturnType<typeof getCountries>> = [];

  try {
    countries = await getCountries();
  } catch {
    countries = [];
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Country Coverage</h1>
        <p className="mt-2 text-slate-600">
          Countries where Pizdit? has election data adapters.
        </p>
      </div>

      {params.country && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          Showing elections for {params.municipality ?? params.region ?? params.country}.
          {" "}
          <Link href={`/api/elections?countryCode=${params.country}`} className="underline">
            View elections
          </Link>
        </div>
      )}

      <div className="grid gap-4">
        {countries.length === 0 ? (
          <p className="text-slate-500">
            No countries configured yet. Connect Supabase to see coverage data.
          </p>
        ) : (
          countries.map((country) => (
            <div
              key={country.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
            >
              <div>
                <h2 className="font-semibold text-slate-900">{country.name}</h2>
                <p className="text-sm text-slate-500">{country.isoCode}</p>
              </div>
              <div className="flex items-center gap-3">
                <CountryCoverageBadge status={country.adapterStatus} />
                <Link
                  href={`/api/elections?countryCode=${country.isoCode}`}
                  className="text-sm font-medium text-slate-900 underline"
                >
                  Elections
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
