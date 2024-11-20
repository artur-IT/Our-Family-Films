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
  rating: Number(movie.rating) || 0,
  comments: Array.isArray(movie.comments) ? movie.comments : [],
});
