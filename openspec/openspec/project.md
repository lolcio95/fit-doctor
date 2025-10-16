# Fitdoctor.pl – Landing (MVP)

## Cel
Szybki, konwertujący landing pod dietę, trening, konsultacje lekarskie (TRT/HRT), psychologię, pakiety i blog.

## Stack
- Next.js (app router), TypeScript, TailwindCSS
- next-seo (SEO), Vercel (deploy)
- Formularze: ankiety (dieta/trening/psychologia) jako osobne podstrony, CTA → checkout (później Medusa/Stripe)

## IA / Routing
/                    – Home (landing)
/oferta/             – listing usług
/oferta/[slug]/      – szczegóły (dieta, trening, psychologia, terapia-hormonalna, suplementacja, recepty)
/pakiety/            – cennik i bundling
/zespol/             – listing specjalistów; /zespol/[slug]
/blog/               – lista artykułów; /blog/[slug]
/ankiety/            – indeks; /ankiety/dieta, /ankiety/trening, /ankiety/psychologia
/kontakt/            – formularz
/konsultacja-lekarska/ – landing medyczny + CTA

## Brand & vibe
Profesjonalnie, jasno, bez „bro science”. Hero: mocny claim, 2–3 przyciski (Kup dietę / Kup trening / Umów konsultację).

## KPI
- CTR na CTA (3 główne)
- Wysyłki formularzy ankiet
- Scroll depth i bounce na Home