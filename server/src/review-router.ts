import express from 'express';
import reviewService from './review-service';

const router = express.Router();

// router.get('/review/score/:id', (request, response) => {
//   const id = Number(request.params.id);
//   reviewService
//     .getGamescore(id)
//     .then((rows) => response.send(rows))
//     .catch((error) => response.status(500).send(error));
// });
router.get('/review/score/:id', (request, response) => {
  const id = Number(request.params.id);
  reviewService
    .getGamescore(id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.get('/reviews/:id', (request, response) => {
  const id = Number(request.params.id);
  reviewService
    .getReviews(id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

export default router;
