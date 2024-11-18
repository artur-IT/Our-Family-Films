export interface MovieData {
  id: string;
  title: string;
  type: string;
  genre: string;
  rating: 0 | 1 | 2 | 3;
  comments: string[];
  image: string;
}
