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

router.post('/games', (request, response) => {
  const offset: number = request.body.offset;
  gameService
    .Carousel(offset)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

export default router;
