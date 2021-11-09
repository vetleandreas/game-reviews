import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000/api/v1';

class GameServices {
  // getAllGames() {
  //   return axios.get('/games').then((response) => response.data);
  // }
  getAllGames(offset: number) {
    return axios.get('/games/' + offset + '/').then((response) => response.data);
  }
  getCarousel(offset: number) {
    return axios.post('/games', { offset: offset }).then((response) => response.data);
  }
  getSelectedGame(slug: string) {
    return axios.get('/game/' + slug).then((response) => response.data);
  }
  searchGame(query: string, offset: number) {
    return axios.get('/search/' + query + '/' + offset).then((response) => response.data);
  }
}

const gameServices = new GameServices();
export default gameServices;
