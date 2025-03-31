import { MovieData } from "./types/types";

export const getInitialData = () => ({
  movies: [],
  selectedTitle: "",
  selectedPoster: "",
  type: "film",
  genre: "",
  link: "",
});

// export const formatMovieData = (movie: MovieData) => ({
//   ...movie,
//   id: movie.id.toString(),
//   ratings: movie.ratings || {},
//   comments: Array.isArray(movie.comments) ? movie.comments : {},
//   movieInfo: {
//     title: movie.title,
//     poster_path: "",
//     link: "",
//     id: null,
//     media_type: "",
//     release_date: "",
//     overview: "",
//     backdrop_path: "",
//     vote_average: null,
//     vote_count: null,
//   },
// });
