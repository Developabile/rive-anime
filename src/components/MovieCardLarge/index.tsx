import { useState, useEffect } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import axiosFetch from "@/Utils/fetchBackend";

// react-lazy-load-image-component
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";

function capitalizeFirstLetter(string: string) {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
}

const MovieCardLarge = ({ data, media_type, genresMovie, genresTv }: any) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [genreListMovie, setGenreListMovie] = useState(genresMovie);
  const [genreListTv, setGenreListTv] = useState(genresTv);
  const [loading, setLoading] = useState(true);
  const [imagePlaceholder, setImagePlaceholder] = useState(false);
  const year = new Date(data?.releaseDate).getFullYear();
  const lang = data?.original_language;
  let Genres: Array<string> = [];

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const gM = await axiosFetch({ requestID: "genresMovie" });
  //       const gT = await axiosFetch({ requestID: "genresTv" });
  //       setGenreListMovie(gM.genres);
  //       setGenreListTv(gT.genres);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);
  return (
    <Link
      key={data?.id}
      href={`/detail?type=${data?.type?.toLowerCase() === "movie" ? "movie" : "tv"}&id=${data?.id}`}
      className={styles.MovieCardSmall}
      aria-label={data?.name || "poster"}
      data-tooltip-id="tooltip"
      data-tooltip-html={`${data?.title?.english?.length > 30 || data?.name?.length > 30 ? data?.title?.english || data?.name : ""}`}
    >
      <div
        className={`${styles.img} ${data?.image !== null && data?.image !== undefined ? "skeleton" : null}`}
      >
        {/* if rllic package is not available, then start using this code again, and comment/delete the rllic code */}
        {/* <AnimatePresence mode="sync">
          <motion.img
            key={data?.id}
            src={`${imagePlaceholder ? "/images/logo.svg" : (data?.image !== null && data?.image !== undefined) || (data?.profile_path !== null && data?.profile_path !== undefined) || (data?.still_path !== null && data?.still_path !== undefined) ? process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + (data?.image || data?.profile_path || data?.still_path) || null : "/images/logo.svg"}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: imageLoading ? 0 : 1,
            }}
            height="100%"
            width="100%"
            exit="exit"
            className={`${styles.img} ${imageLoading ? "skeleton" : null}`}
            onLoad={() => {
              setTimeout(() => {
                setImageLoading(false);
                setLoading(false);
              }, 100);
            }}
            loading="lazy"
            onError={(e) => {
              // console.log({ e });
              setImagePlaceholder(true);
            }}
            alt={data?.id || "sm"}
            // style={!imageLoading ? { opacity: 1 } : { opacity: 0 }}
          />
        </AnimatePresence> */}

        {/* react-lazy-load-image-component */}
        <LazyLoadImage
          key={data?.id}
          src={`${data?.image?.replace("/large/", "/medium/")}`}
          height="100%"
          width="100%"
          useIntersectionObserver={true}
          effect="opacity"
          className={`${styles.img} ${imageLoading ? "skeleton" : null}`}
          onLoad={() => {
            setTimeout(() => {
              setImageLoading(false);
              setLoading(false);
            }, 100);
          }}
          loading="lazy"
          onError={(e) => {
            // console.log({ e });
            setImagePlaceholder(true);
            setImageLoading(false);
          }}
          alt={data?.id || "sm"}
          // style={!imageLoading ? { opacity: 1 } : { opacity: 0 }}
        />
      </div>
      <div className={`${styles.metaData}`}>
        <h1>
          {data?.title?.english || data?.title?.userPreferred || (
            <Skeleton count={2} />
          )}
        </h1>
        <p>
          {capitalizeFirstLetter(data?.type?.toLowerCase() || "")}
          {data?.rating ? ` • ${data?.rating.toFixed(0)}%` : null}
          {!Number.isNaN(year)
            ? ` • ${year}`
            : data?.episodes && ` • ${data?.episodes}`}{" "}
          {data?.status !== undefined ? ` • ${data?.status}` : null}
        </p>
        <p>{data?.subOrDub ? `(${data?.subOrDub})` : null}</p>
        {data?.genres?.join(
          ", ",
        ) // || <Skeleton />
        }
      </div>
    </Link>
  );
};

export default MovieCardLarge;
