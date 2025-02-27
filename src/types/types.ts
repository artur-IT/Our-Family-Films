export interface MovieData {
  id: string;
  title: string;
  type: string;
  genre: string;
  ratings: Record<string, number>;
  comments: Record<string, string>;
  image: string;
}
