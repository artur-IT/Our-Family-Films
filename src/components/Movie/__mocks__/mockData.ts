// Mock dla danych filmu
export const mockMovie = {
  id: "1",
  title: "Lord of the rings",
  type: "Film",
  genre: "Fantasy",
  image: "/images/lotr.jpg",
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
