export interface MovieData {
  id: number;
  title: string;
  year?: number;
  genre: string;
  rating: 0 | 1 | 2 | 3;
  comments: string[];
  image: string;
}
