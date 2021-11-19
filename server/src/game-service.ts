import axios from 'axios';

export type Carousel = {
  id: number;
  name: string;
  cover: string;
  url: string;
  slug: string;
  offset: number;
};
export type AllGames = {
  // name, cover.url, genres.name, slug; offset ${offset};
  id: number;
  name: string;
  cover: string;
  genres: [];
  slug: string;
  offset: number;
};

class GameService {
  Carousel(offset: number) {
    return new Promise((resolve, reject) => {
      axios({
        url: process.env.IGDB_URL + 'games',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Client-ID': process.env.CLIENT_ID,
          Authorization: process.env.AUTHORIZATION,
        },
        // data: `fields name, cover.url, genres.name, slug; offset ${offset}; limit 5; where cover != null;`,
        data: `fields name, cover.url, genres.name, slug, total_rating; sort total_rating desc; offset ${offset}; limit 5; where cover != null; where rating != null;`,
      })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }

  getAllGames(offset: number) {
    return new Promise((resolve, reject) => {
      axios({
        url: process.env.IGDB_URL + 'multiquery',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Client-ID': process.env.CLIENT_ID,
          Authorization: process.env.AUTHORIZATION,
        },
        // data: `query games/count "Count of Games" {fields *;limit 1; where cover != null;}; query games "All Games" {fields rating, name, cover.url, genres.name, slug; offset ${offset}; limit 20; where cover != null; sort rating desc;};`,
        data: `query games/count "Count of Games" {fields *;limit 1; where cover != null; where rating != null;}; query games "All Games" {fields name, cover.url, genres.name, slug, total_rating; sort total_rating desc; offset ${offset}; limit 20; where cover != null; where rating != null;};`,
      })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
  getAllPlatforms() {
    return new Promise((resolve, reject) => {
      axios({
        url: process.env.IGDB_URL + 'platforms',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Client-ID': process.env.CLIENT_ID,
          Authorization: process.env.AUTHORIZATION,
        },
        // Max limit to IGDB is 500. Gets all platfoms since number of platforms is less than limit.
        data: `fields name, platform_logo.url, slug, category, id; limit 500;`,
      })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
  getSelectedGame(slug: string) {
    return new Promise((resolve, reject) => {
      axios({
        url: process.env.IGDB_URL + 'games',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Client-ID': process.env.CLIENT_ID,
          Authorization: process.env.AUTHORIZATION,
        },
        data: `fields total_rating, total_rating_count, parent_game.name, parent_game.slug, parent_game.cover.url, expansions.name, expansions.slug, expansions.cover.url, videos.name, storyline, videos.video_id, websites.*, release_dates.human, name,slug, summary, genres.name,cover.height, cover.width, cover.url, platforms.name, platforms.platform_logo.url, involved_companies.company.name,similar_games.cover.url, similar_games.name, similar_games.genres.name, similar_games.slug; where slug = "${slug}"; limit 1;`,
      })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
  getSearch(query: string, offset: number) {
    return new Promise((resolve, reject) => {
      axios({
        url: process.env.IGDB_URL + 'games',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Client-ID': process.env.CLIENT_ID,
          Authorization: process.env.AUTHORIZATION,
        },
        data: `fields name, cover.url, genres.name, platforms.name, slug; search "${query}"; offset ${offset}; limit 20; where cover != null;`,
      })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
}

const gameService = new GameService();
export default gameService;
