// Mock dla danych filmu
export const mockMovie = {
  id: "1",
  title: "Lord of the rings",
  type: "Film",
  genre: "Fantasy",
  ratings: {
    user1: 3,
    user2: 2,
    user3: 3,
  },
  comments: {
    user1: "Great movie!",
    user2: "Nice one",
    user3: "Great!",
  },
  order: 0,
  info: {
    image: "/images/lotr.jpg",
    link: "https://www.themoviedb.org/movie/1",
    media_type: "movie",
    release_date: "2001-12-19",
    overview: "An epic adventure set in Middle-earth, where various races unite against the evil Sauron.",
    backdrop_path: "/lotr.jpg",
    vote_average: 7.9,
    vote_count: 1000,
  },
};

// Mock dla kontekstu filmów
export const mockMovieContext = {
  movies: [mockMovie],
  deleteMovie: jest.fn(),
  addMovie: jest.fn(),
  editMovie: jest.fn(),
  updateMovie: jest.fn(),
  useMovie: jest.fn(),
  selectedTitle: "",
  selectedPoster: "",
  movieLink: "",
  movieInfo: [],
  setMovieInfo: jest.fn(),
  setMovieLink: jest.fn(),
  setSelectedTitle: jest.fn(),
  setSelectedPoster: jest.fn(),
  updateDragDropMovie: jest.fn(),
};

// Mock dla kontekstu edycji
export const mockEditContext = {
  isEditMode: true,
  showAddMovie: false,
  user: "",
  checkUser: jest.fn(),
  toggleShowAddMovie: jest.fn(),
  toggleEditMode: jest.fn(),
};
