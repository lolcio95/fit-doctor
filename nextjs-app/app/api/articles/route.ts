import { sanityFetch } from "@/sanity/lib/live";
import { getRecentArticlesQuery,  getAllArticlesQuery } from "@/sanity/lib/queries";
import { NextRequest } from "next/server";
import { PER_PAGE } from "./consts";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const type = req.nextUrl.searchParams.get("type");
  const pageParam = req.nextUrl.searchParams.get("page")
  const page = Number.isNaN(Number(pageParam)) ? 0 : Number(pageParam)
  const pageStart = page * PER_PAGE;
  const pageEnd = page * PER_PAGE + PER_PAGE;

  const { data: articles } = await 
    sanityFetch({ query: type === 'all' ? getAllArticlesQuery : getRecentArticlesQuery, params: {categoryName: category, pageStart, pageEnd} })
  ;
  return Response.json(articles);
}
