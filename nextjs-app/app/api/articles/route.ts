import { sanityFetch } from "@/sanity/lib/live";
import { getRecentArticlesQuery,  getAllArticlesQuery, searchArticlesQuery } from "@/sanity/lib/queries";
import { NextRequest } from "next/server";
import { PER_PAGE } from "./consts";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const type = req.nextUrl.searchParams.get("type");
  const search = req.nextUrl.searchParams.get("search");
  const pageParam = req.nextUrl.searchParams.get("page")
  const page = Number.isNaN(Number(pageParam)) ? 0 : Number(pageParam)
  const pageStart = page * PER_PAGE;
  const pageEnd = page * PER_PAGE + PER_PAGE;

  // If search query is provided, use search query
  if (search && search.trim()) {
    const { data: articles } = await sanityFetch({ 
      query: searchArticlesQuery, 
      params: { searchTerm: search, categoryName: category, pageStart, pageEnd } 
    });
    return Response.json(articles);
  }

  const { data: articles } = await 
    sanityFetch({ query: type === 'all' ? getAllArticlesQuery : getRecentArticlesQuery, params: {categoryName: category, pageStart, pageEnd} })
  ;
  return Response.json(articles);
}
