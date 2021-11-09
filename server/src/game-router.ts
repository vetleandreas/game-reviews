import express, { request } from 'express';
import gameService from './game-service';

const router = express.Router();

/* 
  Game-service routes
*/

router.get('/games/:offset', (request, response) => {
  const offset: number = request.params.offset ? Number(request.params.offset) : 0;
  gameService
    .getAllGames(offset)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});
router.get('/game/:slug', (request, response) => {
  const slug: string = request.params.slug ? String(request.params.slug) : '';
  gameService
    .getSelectedGame(slug)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.post('/games', (request, response) => {
  const offset: number = request.body.offset;
  gameService
    .Carousel(offset)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

// Search
router.get('/search/:query/:offset', (request, response) => {
  const query: string = request.params.query ? String(request.params.query) : '';
  const offset: number = request.params.offset ? Number(request.params.offset) : 0;
  gameService
    .getSearch(query, offset)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

export default router;
