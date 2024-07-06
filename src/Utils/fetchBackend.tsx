import axios from "axios";
import { setCache, getCache } from "./clientCache";

interface Fetch {
  requestID: any;
  id?: string | null;
  provider?: string | null;
  page?: number;
  perPage?: number;
  genreKeywords?: string;
  sortBy?: string;
  query?: string;
  season?: any;
  format?: string;
  year?: string;
  animeStatus?: string;
}
export default async function axiosFetch({
  requestID,
  id,
  provider = "gogoanime",
  page = 1,
  perPage = 20,
  genreKeywords,
  sortBy,
  query,
  season,
  format,
  year,
  animeStatus,
}: Fetch) {
  const request = requestID;
  // const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseURL = "/api/backendfetch";
  // const randomURL = process.env.NEXT_PUBLIC_RANDOM_URL;
  const requests: any = {
    trendingAnime: `${baseURL}?requestID=trendingAnime&page=${page}&perPage=${perPage}`,
    popularAnime: `${baseURL}?requestID=popularAnime&page=${page}&perPage=${perPage}`,
    randomAnime: `${baseURL}?requestID=randomAnime`,

    airingSchedule: `${baseURL}?requestID=airingSchedule`,

    infoAnime: `${baseURL}?requestID=infoAnime&id=${id}&provider=${provider}`,
    recentEpisodesAnime: `${baseURL}?requestID=recentEpisodesAnime&page=${page}&perPage=${perPage}&provider=${provider}`,

    episodeStreamingLinks: `${baseURL}?requestID=episodeStreamingLinks&id=${id}`,

    search: `${baseURL}?requestID=search&query=${query}&page=${page}`,
    advancedSearch: `${baseURL}?requestID=advancedSearch${query != undefined ? "&query=" + query : ""}&page=${page}&perPage=${perPage}${season != undefined ? "&season=" + season : ""}${format != undefined ? "&format=" + format : ""}${sortBy != undefined ? "&sort=" + sortBy : ""}${genreKeywords != undefined ? "&genres=" + genreKeywords : ""}${id != undefined ? "&id=" + id : ""}${year != undefined ? "&year=" + year : ""}${animeStatus != undefined ? "&status=" + animeStatus : ""}`,
  };
  const final_request = requests[request];
  // console.log({ final_request });

  // client side caching
  const cacheKey = final_request;
  const cachedResult = await getCache(cacheKey);
  if (
    cachedResult &&
    cachedResult !== null &&
    cachedResult !== undefined &&
    cachedResult !== ""
  ) {
    return await cachedResult;
  }

  try {
    const response = await axios.get(final_request);
    if (response?.data?.data !== null) setCache(cacheKey, response?.data);
    return await response?.data; // Return the resolved data from the response
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors appropriately (e.g., throw a custom error or return null)
    // throw new Error("Failed to fetch data"); // Example error handling
  }
}
