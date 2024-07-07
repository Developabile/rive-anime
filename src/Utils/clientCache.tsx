// session storage
// const CACHE_TTL: number = 1800; // Cache TTL in seconds (1/2 hour)
// // Function to set data in the cache
// export function setCache(key: any, data: any) {
//   const StorageData = {
//     data: data,
//     timestamp: Date.now(),
//   };
//   sessionStorage?.setItem(key, JSON.stringify(StorageData));
// }
// // Function to get data from the cache
// export function getCache(key: any) {
//   const StorageData: any = sessionStorage?.getItem(key) || null;
//   const cachedData: any = JSON.parse(StorageData);
//   if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL * 1000) {
//     // Data is within TTL, return it
//     return cachedData?.data;
//   } else {
//     // Data not found in cache or expired
//     cachedData && sessionStorage?.removeItem(key); // Remove expired data from cache
//     // console.log(`${cachedData && Date.now() - cachedData.timestamp} : deleting cache`);
//     return null;
//   }
// }

// cache storage
const CACHE_NAME = "rivekun-api-data";
const CACHE_TTL: number = 1800; // Cache TTL in seconds (1/2 hour)

// Function to set data in the cache
export async function setCache(key: string, data: any) {
  const StorageData = {
    data: data,
    timestamp: Date.now(),
  };
  const cache = await caches.open(CACHE_NAME);
  const response = new Response(JSON.stringify(StorageData));
  await cache.put(new Request(key), response);
}

// Function to get data from the cache
export async function getCache(key: string) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(new Request(key));

  if (!cachedResponse) {
    // Data not found in cache
    return null;
  }

  const cachedData = await cachedResponse.json();
  if (Date.now() - cachedData.timestamp < CACHE_TTL * 1000) {
    // Data is within TTL, return it
    return cachedData.data;
  } else {
    // Data expired, remove it from cache
    await cache.delete(new Request(key));
    // console.log(`${Date.now() - cachedData.timestamp} : deleting cache`);
    return null;
  }
}
