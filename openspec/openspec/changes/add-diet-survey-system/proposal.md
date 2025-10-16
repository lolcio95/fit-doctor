## Why
Użytkownicy potrzebują spersonalizowanej diety bazującej na ich preferencjach, ograniczeniach żywieniowych i celach zdrowotnych. Aktualnie brak systemu zbierania tych informacji.

## What Changes
- Dodanie interaktywnego systemu ankiet dietetycznych
- Formularz wieloetapowy z walidacją
- Zapisywanie odpowiedzi użytkowników
- Generowanie rekomendacji na podstawie odpowiedzi
- Integracja z systemem CTA/checkout

## Impact
- Affected specs: surveys (nowa capability)
- Affected code: 
  - `nextjs-app/app/ankiety/dieta/` (nowy routing)
  - `nextjs-app/components/organisms/` (komponenty formularza)
  - `nextjs-app/app/api/surveys/` (API endpoints)
  - `nextjs-app/utils/` (logika walidacji)