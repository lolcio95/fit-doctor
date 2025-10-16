## 1. Przygotowanie struktury danych
- [x] 1.1 Utworzyć schema Article w Sanity Studio
- [x] 1.2 Dodać schema Category i Tag
- [x] 1.3 Skonfigurować relacje między schematami
- [ ] 1.4 Przygotować sample content

## 2. Implementacja routingu
- [x] 2.1 Utworzyć `/blog` - lista artykułów z paginacją
- [x] 2.2 Utworzyć `/blog/[slug]` - pojedynczy artykuł
- [x] 2.3 Dodać filtrowanie po kategoriach
- [ ] 2.4 Implementować wyszukiwanie

## 3. Komponenty i UI
- [x] 3.1 BlogCard - karta artykułu na liście
- [x] 3.2 ArticleContent - wyświetlanie treści artykułu
- [x] 3.3 CategoryFilter - filtrowanie kategorii
- [ ] 3.4 SearchBox - wyszukiwanie artykułów
- [ ] 3.5 NewsletterSignup - formularz subskrypcji (API gotowe, brak UI)

## 4. API i integracje
- [x] 4.1 API endpoint `/api/newsletter` - subskrypcja
- [x] 4.2 Rozszerzyć `fetchArticles.ts` o filtrowanie
- [x] 4.3 Implementować generateStaticParams dla SSG
- [x] 4.4 Dodać RSS feed

## 5. SEO i optymalizacja
- [x] 5.1 Meta tags dla każdego artykułu
- [x] 5.2 Structured data (JSON-LD)
- [x] 5.3 Sitemap integration
- [ ] 5.4 Internal linking between articles