# Portugal Country Adapter

Status: **BETA**

## Official Sources

- [Comissão Nacional de Eleições (CNE)](https://www.cne.pt/)
- [Instituto Nacional de Estatística (INE)](https://www.ine.pt/)
- [Portal das Finanças](https://www.portaldasfinancas.gov.pt/)

## Supported Election Levels

- Municipal (MVP seed: Porto Municipal Council Election)

## District Matching

MVP uses seeded electoral districts for Porto (Cedofeita, Bonfim, Campanhã, Paranhos).
Geocoding via Nominatim maps addresses containing "Porto" to the Porto municipality.

## Known Limitations

- No live API integration with CNE in MVP
- Election and candidate data is seeded via migrations/scripts
- District boundaries are not geospatially matched (text-based fallback)

## Legal Notes

Analysis must use careful wording per project methodology. Do not make unsupported personal accusations.
