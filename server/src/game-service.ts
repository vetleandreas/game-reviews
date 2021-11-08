import axios from 'axios';
import { response } from 'express';

// Consts
const CLIENT_ID: string = 'bjequgi11fqs17m4jnf6gw6t0bomi9';
const AUTHORIZATION: string = 'Bearer 16s6191dxznnri6ujpl8ccb8atjk7r';

class GameService {
  Carousel(offset: number) {
    return new Promise((resolve, reject) => {
      axios({
        url: 'https://api.igdb.com/v4/games',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Client-ID': process.env.CLIENT_ID,
          Authorization: process.env.AUTHORIZATION,
        },
        data: `fields name, cover.url, genres.name, slug; offset ${offset}; limit 5; where cover != null;`,
      })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
  getAllGames(offset: number) {
    return new Promise((resolve, reject) => {
      axios({
        url: 'https://api.igdb.com/v4/multiquery',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Client-ID': process.env.CLIENT_ID,
          Authorization: process.env.AUTHORIZATION,
        },
        data: `query games/count "Count of Games" {fields *;limit 1; where cover != null;}; query games "All Games" {fields name, cover.url, genres.name, slug; offset ${offset}; limit 20; where cover != null;};`,
      })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
  getSelectedGame(slug: string) {
    return new Promise((resolve, reject) => {
      axios({
        url: 'https://api.igdb.com/v4/games',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Client-ID': process.env.CLIENT_ID,
          Authorization: process.env.AUTHORIZATION,
        },
        data: `fields parent_game.name, parent_game.slug, parent_game.cover.url, expansions.name, expansions.slug, expansions.cover.url, videos.name, storyline, videos.video_id, websites.*, release_dates.human, name,slug, summary, genres.name,cover.height, cover.width, cover.url, platforms.name, platforms.platform_logo.url, involved_companies.company.name,similar_games.cover.url, similar_games.name, similar_games.genres.name, similar_games.slug; where slug = "${slug}"; limit 1;`,
      })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
  getSearch(query: string, offset: number) {
    return new Promise((resolve, reject) => {
      axios({
        url: 'https://api.igdb.com/v4/games',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Client-ID': process.env.CLIENT_ID,
          Authorization: process.env.AUTHORIZATION,
        },
        data: `fields name, cover.url, genres.name, platforms.name, slug; search "${query}"; offset ${offset}; limit 50; where cover != null;`,
      })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
}

const gameService = new GameService();
export default gameService;