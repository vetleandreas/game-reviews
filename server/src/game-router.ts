import express, { request } from 'express';
import gameService from './game-service';
import { gameSearch, getGame, getGames, getGamesOffset, getPlatforms } from './game-controller';

const router = express.Router();

/* 
  Game-service routes
*/

// Gets all the games from IGDB and offsets the list
router.post('/games', getGames);
// Offsets the list in all games
router.get('/games/:offset', getGamesOffset);

// Gets the selected game - Datatype any atm
router.get('/game/:slug', getGame);

// Gets all platforms
router.get('/platforms', getPlatforms);

// Search games. Can only search for games at the moment.
router.get('/search/:query/:offset', gameSearch);

export default router;
