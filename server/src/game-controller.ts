import express, { request } from 'express';
import gameService from './game-service';

const router = express.Router();

// Remake - Datatype any atm
export const getGames = (request: any, response: any) => {
  const offset: number = request.body.offset;
  gameService
    .Carousel(offset)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
};

// Gets all the games from IGDB and offsets the list - Datatype any atm
export const getGamesOffset = (request: any, response: any) => {
  const offset: number = request.params.offset ? Number(request.params.offset) : 0;
  gameService
    .getAllGames(offset)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
};

// Gets the selected game - Datatype any atm
export const getGame = (request: any, response: any) => {
  const slug: string = request.params.slug ? String(request.params.slug) : '';
  gameService
    .getSelectedGame(slug)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
};

// Search games. Can only search for games at the moment - Datatype any atm
export const gameSearch = (request: any, response: any) => {
  const query: string = request.params.query ? String(request.params.query) : '';
  const offset: number = request.params.offset ? Number(request.params.offset) : 0;
  gameService
    .getSearch(query, offset)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
};
