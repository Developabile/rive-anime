import type { NextApiRequest, NextApiResponse } from "next";
import axiosFetch from "@/Utils/fetch";
import { getCache, setCache } from "@/Utils/cache";

export const runtime = "edge";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default async function handler(
  req: NextRequest,
  res: NextApiResponse<any>,
) {
  const ApiQuery = Object.fromEntries(req?.nextUrl?.searchParams?.entries());
  const cacheKey = JSON.stringify(ApiQuery);

  // Check if the result for this query is already cached
  const cachedResult = getCache(cacheKey);
  if (cachedResult) {
    return NextResponse.json(cachedResult);
  }
  const {
    requestID,
    id,
    provider,
    page,
    perPage,
    genreKeywords,
    sortBy,
    query,
    season,
    format,
    year,
    animeStatus,
  }: any = ApiQuery;
  // console.log({
  //   requestID,
  //   id,
  //   provider,
  //   page,
  //   perPage,
  //   genreKeywords,
  //   sortBy,
  //   query,
  //   season,
  //   format,
  //   animeStatus
  // });
  const result: any = await axiosFetch({
    requestID,
    id,
    provider,
    page,
    perPage,
    genreKeywords,
    sortBy,
    query,
    season,
    format,
    year,
    animeStatus,
  });
  // Cache the result
  setCache(cacheKey, result);
  // console.log({ result });
  return NextResponse.json(result);
  // res.status(200).json({ name: "John Doe" });
}
