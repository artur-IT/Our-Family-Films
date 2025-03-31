export interface MovieData {
  id: string;
  title: string;
  type?: string;
  genre?: string;
  ratings?: Record<string, number>;
  comments?: Record<string, string>;
  order?: number;
  info: {
    image: string;
    link: string;
    media_type: string;
    release_date?: string;
    overview?: string;
    backdrop_path?: string;
    vote_average?: number;
    vote_count?: number;
  };
}
