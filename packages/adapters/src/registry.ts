import type { CountryAdapter } from "./interface";

const adapters = new Map<string, CountryAdapter>();

export function registerAdapter(adapter: CountryAdapter): void {
  adapters.set(adapter.countryCode.toUpperCase(), adapter);
}

export function getAdapter(countryCode: string): CountryAdapter | undefined {
  return adapters.get(countryCode.toUpperCase());
}

export function getAllAdapters(): CountryAdapter[] {
  return Array.from(adapters.values());
}
