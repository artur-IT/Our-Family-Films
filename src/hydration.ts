import { MovieData } from "./types/types";

export const getInitialData = () => ({
  movies: [],
  selectedTitle: "",
  selectedPoster: "",
  type: "film",
  genre: "",
});

export const formatMovieData = (movie: MovieData) => ({
  ...movie,
  id: movie.id.toString(),
  ratings: movie.ratings || {},
  comments: Array.isArray(movie.comments) ? movie.comments : {},
});
