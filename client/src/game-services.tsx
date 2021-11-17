import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000/api/v1';

export type CarouselItems = {
  id: number;
  name: string;
  cover: [];
  url: string;
  slug: string;
  offset: number;
};
export type AllGamesItems = {
  // name, cover.url, genres.name, slug; offset ${offset};
  id: number;
  name: string;
  cover: [];
  genres: [];
  slug: string;
  offset: number;
  count: number;
  result: [];
};
export type GameReviewsItems = {
  id: number;
  review_title: string;
  created_at: string;
  review_text: string;
  created_by_id: number;
  gameId: number;
};

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
