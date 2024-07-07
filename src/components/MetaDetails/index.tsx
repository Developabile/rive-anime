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
const MetaDetails = ({ id, type, data }: any) => {
  const [category, setCategory] = useState<any>("description"); // latest, trending, topRated
  // const [data, setdata] = useState<any>();
  const [imageLoading, setImageLoading] = useState<any>(true);
  const [reviewDetail, setReviewDetail] = useState<any>("");
  const [selectedSeason, setSelectedSeason] = useState<any>(1);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalpages, setTotalpages] = useState(1);
  const [genreListMovie, setGenreListMovie] = useState<any>();
  const [genreListTv, setGenreListTv] = useState<any>();
  const [imagePlaceholder, setImagePlaceholder] = useState(false);
  const metaDetailsPage: any = useRef(null);

  const release_date = new Date(data?.releaseDate || data?.firstAirDate);
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

  const scrollToTop = () => {
    metaDetailsPage?.current?.scrollTo(0, 0);
  };

  return (
    <div className={styles.MetaDetailPage}>
      <div className={styles.MetaDetails} ref={metaDetailsPage}>
        <div className={styles.category}>
          {/* {type === "tv" ? ( */}
          <p
            className={`${category === "episodes" ? styles.active : styles.inactive}`}
            onClick={() => setCategory("episodes")}
          >
            Episodes
          </p>
          {/* // ) : null} */}
          <p
            className={`${category === "description" ? styles.active : styles.inactive}`}
            onClick={() => setCategory("description")}
          >
            description
          </p>
          <p
            className={`${category === "related" ? styles.active : styles.inactive}`}
            onClick={() => setCategory("related")}
          >
            Related
          </p>
        </div>
        {category === "episodes" ? (
          <div className={styles.EpisodeList}>
            {category === "episodes" &&
              data?.episodes?.map((ele: any) => {
                return (
                  <Link
                    href={`/watch?type=tv&id=${ele?.id}&season=${id}&episode=${ele?.number}`}
                    className={`${styles.episode}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={styles.episodeHeader}>
                      <h4>
                        {/* {`EP ${ele.number}`} */}
                        {`${ele?.title ? ele?.title : ele?.number}`}
                      </h4>
                    </div>
                  </Link>
                );
              })}
          </div>
        ) : null}

        {category === "episodes" && data?.episodes?.length === 0 ? (
          <p>No Episodes Found</p>
        ) : null}

        {category === "episodes" && data === undefined
          ? dummyList.map((ele) => (
              <div className={styles.episode}>
                <Skeleton
                  height={100}
                  className={styles.CardSmall}
                  style={{ margin: "0.5rem 0" }}
                />
              </div>
            ))
          : null}
        <div className={styles.categoryDetails}>
          {category === "description" && type !== "person" && (
            <>
              {data?.tagline ? (
                <h4>
                  <q>{data?.tagline}</q>
                </h4>
              ) : null}
              {/* <p>{data?.description}</p> */}
              <p dangerouslySetInnerHTML={{ __html: data?.description }}></p>
              {release_date.getDate() ? (
                <>
                  <h3>Release</h3>
                  <p>{`${data?.startDate?.day} ${monthNames[data?.startDate?.month]} ${data?.startDate?.year}`}</p>
                </>
              ) : null}
              {data?.runtime ? (
                <>
                  <h3>Runtime</h3>
                  <p>
                    {data?.runtime >= 60
                      ? `${Math.floor(data?.runtime / 60)}hr ${(data?.runtime % 60).toFixed(0)}min`
                      : null}
                    {data?.runtime < 60
                      ? `${(data?.runtime % 60).toFixed(0)} min`
                      : null}
                  </p>
                </>
              ) : null}
              {data?.genres?.length > 0 ? (
                <>
                  <h3>Genre</h3>
                  <p>{data?.genres?.join(", ")}</p>
                </>
              ) : null}
              {data?.status && (
                <>
                  <h3>Show Details</h3>
                  {data?.status && <p> Status : {data?.status}</p>}
                  {data?.number_of_seasons && (
                    <p> Total Seasons : {data?.number_of_seasons}</p>
                  )}
                  {data?.number_of_episodes && (
                    <p> Total Episodes : {data?.number_of_episodes}</p>
                  )}
                  {data?.next_episode_to_air !== null ? (
                    <p>
                      {" "}
                      Next Episode to Air :{" "}
                      {data?.next_episode_to_air?.episode_number} (
                      {new Date(data?.next_episode_to_air?.air_date).getDate()}{" "}
                      {
                        monthNames[
                          new Date(
                            data?.next_episode_to_air?.air_date,
                          ).getMonth()
                        ]
                      }{" "}
                      {new Date(
                        data?.next_episode_to_air?.air_date,
                      ).getFullYear()}
                      )
                    </p>
                  ) : null}
                  {release_date && data?.endDate?.year && (
                    <p>
                      {" "}
                      Aired :{" "}
                      {`${release_date.getDate()} ${monthNames[release_date.getMonth()]} ${release_date.getFullYear()}`}{" "}
                      -{" "}
                      {data?.status !== "Completed"
                        ? "ongoing"
                        : `${data?.endDate?.day} ${monthNames[data?.endDate?.month]} ${data?.endDate?.year}`}
                    </p>
                  )}
                </>
              )}
              {/* {data?.spoken_languages?.length > 0 ? (
                <>
                  <h3>Spoken Languages</h3>
                  <p>{data?.spoken_languages?.join(", ")}</p>
                </>
              ) : null} */}
              {data?.countryOfOrigin?.length > 0 ? (
                <>
                  <h3>Country of Origin</h3>
                  <p>{data?.countryOfOrigin}</p>
                </>
              ) : null}
              {data?.studios?.length > 0 ? (
                <>
                  <h3>Production Companies</h3>
                  <p>{data?.studios?.join(", ")}</p>
                </>
              ) : null}
            </>
          )}
          {/* {category === "description" && type === "person" && (
            <>
              <p>{data?.biography}</p>
              {birthday.getDate() ? (
                <>
                  <h3>Birthday</h3>
                  <p>{`${birthday.getDate()} ${monthNames[birthday.getMonth()]} ${birthday.getFullYear()}`}</p>
                </>
              ) : null}
              {data?.place_of_birth ? (
                <>
                  <h3>Place of Birth</h3>
                  <p>{data?.place_of_birth}</p>
                </>
              ) : null}
              {data?.known_for_department ? (
                <>
                  <h3>Department</h3>
                  <p>{data?.known_for_department}</p>
                </>
              ) : null}
            </>
          )} */}
          {category === "description" &&
            (data == undefined || data === null) && (
              <Skeleton count={10} style={{ margin: "0.5rem 0" }} />
            )}
          <div className={styles.MovieList}>
            <>
              {category === "related" &&
                data?.recommendations?.map((ele: any, ind: any) => {
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
            {category === "related" && data?.recommendations?.length === 0 && (
              <p>No Recommendations</p>
            )}
            {category === "related" &&
              data === undefined &&
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

export default MetaDetails;
