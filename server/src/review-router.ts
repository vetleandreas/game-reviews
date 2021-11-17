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

// Get upvotes
router.get('/review/upvote/:reviewId/:userId', (request, response) => {
  const userId = Number(request.params.userId);
  const reviewId = Number(request.params.reviewId);
  reviewService
    .getUpvotes(userId, reviewId)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});
// Posts upvote
router.post('/review/upvote/', (request, response) => {
  const data = request.body;
  if (data) {
    reviewService
      .upvoteReview(data.userId, data.reviewId, data.upvote)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  } else response.status(400).send('An unexpected error occurred.');
});

// Updates review relevance
router.put('/review/upvote', (request, response) => {
  const data = request.body;
  reviewService
    .upvoteReviewUpdate(data.id)
    .then((id) => response.send(id))
    .catch((error) => response.status(500).send(error));
});

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
