import express, { request } from 'express';
import gameService from './game-service';
import { gameSearch, getGame, getGames, getGamesOffset, getPlatforms } from './game-controller';

const router = express.Router();

/* 
  Game-service routes
*/

// // Gets all the games from IGDB and offsets the list
// router.post('/games', getGames);
// // Offsets the list in all games
// router.get('/games/:offset', getGamesOffset);

// // Gets the selected game - Datatype any atm
// router.get('/game/:slug', getGame);

// // Gets all platforms
// router.get('/platforms', getPlatforms);

// // Search games. Can only search for games at the moment.
// router.get('/search/:query/:offset', gameSearch);

// Gets all the games from IGDB and offsets the list
router.post('/games', (request: any, response: any) => {
  const offset: number = request.body.offset;
  gameService
    .Carousel(offset)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});
// Offsets the list in all games
router.get('/games/:offset', (request: any, response: any) => {
  const offset: number = request.params.offset ? Number(request.params.offset) : 0;
  gameService
    .getAllGames(offset)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

// Gets the selected game - Datatype any atm
router.get('/game/:slug', (request: any, response: any) => {
  const slug: string = request.params.slug ? String(request.params.slug) : '';
  gameService
    .getSelectedGame(slug)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

// Gets all platforms
router.get('/platforms', (request: any, response: any) => {
  gameService
    .getAllPlatforms()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

// Search games. Can only search for games at the moment.
router.get('/search/:query/:offset', (request: any, response: any) => {
  const query: string = request.params.query ? String(request.params.query) : '';
  const offset: number = request.params.offset ? Number(request.params.offset) : 0;
  gameService
    .getSearch(query, offset)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

export default router;
