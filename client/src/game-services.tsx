import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000/api/v1';

// Typesjekk: Ok for CarouselItems
export type CarouselItems = {
  id: number;
  name: string;
  cover: { id: number; url: string };
  genres: { id: number; name: string };
  url: string;
  slug: string;
  offset: number;
  total_rating: number;
};
// Typesjekk: Ok for AllGamesItems
export type AllGamesItems = {
  id: number;
  name: string;
  cover: { id: number; url: string };
  // Workaroud (Type any): Property 'map' does not exist on type
  genres: Object[] | { id: number; name: string } | any;
  slug: string;
  offset: number;
  count: number;
  result: [];
};
// need to add any so there is no type error on JavaScript functions.
export type GameReviewsItems = {
  id: number;
  name: string;
  parent_game: { id: number; name: string; slug: string; cover: { id: number; url: string } };
  expansions:
    | Object[]
    | { id: number; name: string; slug: string; cover: { id: number; url: string } }
    | any;
  slug: string;
  cover: { id: number; url: string; height: number; width: number };
  genres: Object[] | { id: number; name: string } | any;
  involved_companies: Object[] | { id: number; company: { id: number; name: string } } | any;
  company: { name: string };
  platforms:
    | Object[]
    | { id: number; name: string; platform_logo: { id: number; url: string } }
    | any;
  release_dates: any | { id: number; human: string };
  similar_games:
    | Object[]
    | {
        id: number;
        name: string;
        slug: string;
        cover: { id: number; url: string };
        genres: { id: number; name: string };
      }
    | any;
  summary: string;
  storyline: string;
  total_rating: number;
  total_rating_count: number;
  videos: { id: number; name: string; video_id: string };
  websites: {
    id: number;
    category: number;
    checksum: string;
    game: number;
    trusted: boolean;
    url: string;
  };
  review_title: string;
  review_name: string;
  score: number;
  created_at: string;
  review_text: string;
  created_by_id: number;
  gameId: number;
};

export type ReviewUpvoteItems = {
  review_id: number;
};

// need to add any so there is no type error on JavaScript functions.
export type ReviewEditItems = {
  [k: string]: string | number;
  review_title: string;
  review_text: string;
  review_id: number | any;
  review_gameid: number | any;
  review_score: number | any;
  created_by_id: string | number | any;
  review_password: string;
};

export type GameScore = {};

class GameServices {
  // getAllGames() {
  //   return axios.get('/games').then((response) => response.data);
  // }
  getAllGames(offset: number) {
    return axios.get<AllGamesItems[]>('/games/' + offset + '/').then((response) => response.data);
  }
  getCarousel(offset: number) {
    return axios.post('/games', { offset: offset }).then((response) => response.data);
  }
  getSelectedGame(slug: string) {
    return axios.get('/game/' + slug).then((response) => response.data);
  }
  getAllPlatforms() {
    return axios.get('/platforms').then((response) => response.data);
  }
  searchGame(query: string, offset: number) {
    return axios.get('/search/' + query + '/' + offset).then((response) => response.data);
  }
}

const gameServices = new GameServices();
export default gameServices;
