import { useState, useEffect, useRef } from "react";
import styles from "./style.module.scss";
import axiosFetch from "@/Utils/fetchBackend";
import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
import MovieCardLarge from "../MovieCardLarge";
import { FaPlay, FaStar } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";

// react-lazy-load-image-component
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const dummyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const WatchDetails = ({
  id,
  type,
  data,
  season,
  episode,
  setWatchDetails,
}: any) => {
  const [category, setCategory] = useState<any>("episodes"); // latest, trending, topRated
  const [categoryData, setCategoryData] = useState<any>();
  const [imageLoading, setImageLoading] = useState<any>(true);
  const [reviewDetail, setReviewDetail] = useState<any>(null);
  const [selectedSeason, setSelectedSeason] = useState<any>(season);
  const [loading, setLoading] = useState(true);
  const [imagePlaceholder, setImagePlaceholder] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalpages, setTotalpages] = useState(1);
  const [genreListMovie, setGenreListMovie] = useState<any>();
  const [genreListTv, setGenreListTv] = useState<any>();
  const watchDetailsPage: any = useRef(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const CapitalCategoryType = capitalizeFirstLetter(category);
      if (category !== "overview") {
        try {
          let res;
          res = await axiosFetch({
            requestID: `infoAnime`,
            id: season,
          });
          setCategoryData(res);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [category, selectedSeason, currentPage]);

  const scrollToTop = () => {
    watchDetailsPage?.current?.scrollTo(0, 0);
  };

  return (
    <div className={styles.MetaDetailPage}>
      <p
        className={`${styles.close} btn`}
        onClick={() => setWatchDetails(false)}
      >
        x
      </p>
      <div className={styles.MetaDetails} ref={watchDetailsPage}>
        <div className={styles.category}>
          <>
            <p
              className={`${category === "episodes" ? styles.active : styles.inactive}`}
              onClick={() => setCategory("episodes")}
            >
              Episodes
            </p>
            <p
              className={`${category === "related" ? styles.active : styles.inactive}`}
              onClick={() => setCategory("related")}
            >
              Related
            </p>
          </>
        </div>

        {category === "episodes" ? (
          <div className={styles.EpisodeList}>
            {category === "episodes" &&
              categoryData?.episodes?.map((ele: any) => {
                return (
                  <Link
                    href={`/watch?type=${categoryData?.type?.toLowerCase() === "movie" ? "movie" : "tv"}&id=${ele?.id}&season=${season}&episode=${ele?.number}`}
                    className={`${styles.episode} ${parseInt(ele?.number) === parseInt(episode) ? styles.highlightEpisode : null}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={styles.episodeHeader}>
                      <h4>
                        {`EP ${ele.number}`}
                        {/* {`${ele?.title?.includes("EP") ? ele?.title : ele?.title ? `EP ${ele?.number}: ${ele?.title}` : ele?.number}`} */}
                      </h4>
                    </div>
                  </Link>
                );
              })}
          </div>
        ) : null}

        {category === "episodes" && categoryData?.episodes?.length === 0 ? (
          <p>No Episodes Found</p>
        ) : null}

        {category === "episodes" && categoryData === undefined
          ? dummyList.map((ele) => (
              <div className={styles.episode}>
                <Skeleton height={100} className={styles.CardSmall} />
              </div>
            ))
          : null}
        <div className={styles.categoryDetails}>
          <div className={styles.MovieList}>
            <>
              {category === "related" &&
                categoryData?.recommendations?.map((ele: any, ind: any) => {
                  return (
                    <div className={styles.numberedCard}>
                      <MovieCardLarge
                        data={ele}
                        media_type={type}
                        genresMovie={genreListMovie}
                        genresTv={genreListTv}
                      />
                      <span className={styles.number}>{ind + 1}</span>
                    </div>
                  );
                })}
            </>
            {category === "related" &&
              categoryData?.recommendations?.length === 0 && (
                <p>No Recommendations</p>
              )}
            {category === "related" &&
              categoryData === undefined &&
              dummyList.map((ele) => (
                <div className={styles.MovieList}>
                  <Skeleton height={150} width={100} />
                  <div>
                    <Skeleton height={20} width={150} />
                    <Skeleton height={20} width={150} />
                    <Skeleton height={20} width={150} />
                  </div>
                </div>
              ))}
          </div>
          <div className={styles.MovieList}>
            <>
              {category === "similar" &&
                categoryData?.results?.map((ele: any) => {
                  return (
                    <MovieCardLarge
                      data={ele}
                      media_type={type}
                      genresMovie={genreListMovie}
                      genresTv={genreListTv}
                    />
                  );
                })}
              {(category === "related" || category === "similar") &&
                categoryData?.results?.length > 0 && (
                  <ReactPaginate
                    containerClassName={styles.pagination}
                    pageClassName={styles.page_item}
                    activeClassName={styles.paginateActive}
                    onPageChange={(event) => {
                      setCurrentPage(event.selected + 1);
                      console.log({ event });
                      if (currentPage > totalpages) {
                        setCurrentPage(totalpages);
                      }
                      // window.scrollTo(0, 0);
                      scrollToTop();
                    }}
                    initialPage={0}
                    pageCount={totalpages}
                    breakLabel=" ... "
                    previousLabel={
                      <AiFillLeftCircle className={styles.paginationIcons} />
                    }
                    nextLabel={
                      <AiFillRightCircle className={styles.paginationIcons} />
                    }
                  />
                )}
            </>
            {category === "similar" && categoryData?.results?.length === 0 && (
              <p>No Recommendations</p>
            )}
            {category === "similar" &&
              categoryData === undefined &&
              dummyList.map((ele) => (
                <div className={styles.MovieList}>
                  <Skeleton height={150} width={100} />
                  <div>
                    <Skeleton height={20} width={150} />
                    <Skeleton height={20} width={150} />
                    <Skeleton height={20} width={150} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchDetails;
