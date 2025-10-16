## Why
Użytkownicy potrzebują dostępu do wartościowych treści edukacyjnych o zdrowiu, diecie i treningu. Blog zwiększy SEO, engagement i pozycjonowanie ekspertów. Zgodnie z project.md planujemy /blog/ routing.

## What Changes
- Dodanie systemu zarządzania artykułami blogowymi
- Integracja z Sanity CMS dla treści
- Routing /blog i /blog/[slug]
- SEO optymalizacja dla artykułów
- System kategorii i tagów
- Formularz subskrypcji newslettera

## Impact
- Affected specs: blog (nowa capability), newsletter (nowa capability) 
- Affected code:
  - `nextjs-app/app/blog/` (nowy routing)
  - `nextjs-app/app/api/newsletter/` (subskrypcja)
  - `studio/src/schemaTypes/` (schemat artykułów)
  - `nextjs-app/utils/fetchArticles.ts` (już istnieje)
- SEO impact: nowe indexed pages, internal linking