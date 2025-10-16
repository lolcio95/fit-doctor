OPR: Landing page – Home (MVP)
Problem / Cel

Potrzebujemy konwertującej strony głównej Fitdoctor.pl, która jasno komunikuje ofertę (dieta, trening, konsultacja lekarska, psychologia, TRT/HRT), prezentuje pakiety i zespół oraz kieruje użytkownika do kluczowych akcji (CTA). Landing ma być szybki, dostępny, przyjazny SEO i gotowy do skalowania.

Zakres

Route/Strona: /
Komponenty (src/components/landing/):

Hero.tsx

OfferTiles.tsx

Pricing.tsx

TeamTeaser.tsx

Testimonials.tsx

BlogTeaser.tsx

FAQ.tsx

FinalCTA.tsx

Inne:

src/app/page.tsx – składanie sekcji

src/lib/seo.ts – domyślne SEO (NextSeo)

proste dane mock (np. src/content/home.ts)

UI/UX

Sekcje i kolejność:

Hero

H1: „Fitdoctor – indywidualna dieta, trening i konsultacje”

Lead (2–3 zdania — o indywidualizacji i opiece).

3 CTA (primary/secondary/outline):

„Kup dietę” → /oferta/dieta

„Kup trening” → /oferta/trening

„Umów konsultację” → /konsultacja-lekarska

Oferta skrócona (kafelki)

Dieta / Trening / Dieta+Trening / Psychologia / Terapia hormonalna (TRT/HRT) / Suplementacja

Każdy kafelek: ikona, 1–2 zdania, link do szczegółu.

Pakiety (cennik)

1 usługa – 350 zł/mies.

2 usługi – 630 zł (−10%)

3 usługi – 890 zł (−15%)

4 usługi (combo) – 1150 zł (−20%)

CTA przy każdym wariancie („Wybieram pakiet”) → /oferta/pakiety lub bezpośredni checkout w przyszłości.

Zespół (teaser)

4 karty: Piotr Głuchowski, Marcin Ochtabiński, Anna Sobolewska-Kucharska, dr Przemysław Roś (placeholdery bio + linki do /zespol/{slug}).

Opinie / Case studies

3 elementy (imię + skrót + rating).

Blog teaser

3 ostatnie artykuły (placeholder tytułu, daty, kategorii).

FAQ (5 pytań)

Akordeon; typowe pytania o indywidualizację planów, wyniki badań, czas odpowiedzi, płatności, bezpieczeństwo danych.

Final CTA

Powtórka 3 przycisków z Hero + krótka korzyść.

Zasady UX: mobile-first, kontrast ≥ WCAG AA, focus-visible, klikalne całe kafelki.
Kopię trzymamy rzeczową, profesjonalną, bez „bro science” (PL).

SEO

NextSeo (tytuł, opis, og:image placeholder).

schema.org:

Organization (na /) – nazwa, logo, contactPoint.

BreadcrumbList.

Headery: 1×H1 (Hero), dalej H2 dla sekcji.

Przy obrazach: alt, rozmiary i loading="lazy".

Wydajność

Lighthouse docelowo ≥ 90 (Performance/SEO/Accessibility/Best Practices).

Optymalizacja: responsywne obrazy, preconnect do fontów, minimalny JS w sekcjach statycznych.

Testy

Playwright (E2E, minimal):

Ładuje / i widzi H1.

3 CTA widoczne i prowadzą do prawidłowych ścieżek (/oferta/dieta, /oferta/trening, /konsultacja-lekarska).

Anchor scroll (jeśli użyte) działa.

AC (Acceptance Criteria)
