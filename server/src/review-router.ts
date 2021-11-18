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
router.get('/review/upvote/', (request, response) => {
  reviewService
    .getUpvotes()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});
// router.get('/review/upvote/:reviewId/:userId', (request, response) => {
//   const userId = Number(request.params.userId);
//   const reviewId = Number(request.params.reviewId);
//   reviewService
//     .getUpvotes(userId, reviewId)
//     .then((rows) => response.send(rows))
//     .catch((error) => response.status(500).send(error));
// });
// Posts upvote

/* UPVOTES */
router.post('/review/upvote/', (request, response) => {
  const data = request.body;
  if (data) {
    reviewService
      .upvoteReview(data.userId, data.reviewId, data.upvote)
      .then((id) => response.send({ id: id }))
      .catch((error) =>
        response.status(500).send('An unexpected error occurred. Culd not post to Database.')
      );
  } else response.status(400).send('An unexpected error occurred.');
});

// Updates review relevance
// router.put('/review/upvote', (request, response) => {
//   const data = request.body;
//   reviewService
//     .upvoteReviewUpdate(data.id)
//     .then((id) => response.send(id))
//     .catch((error) => response.status(500).send(error));
// });

router.get('/review/score/:id', (request, response) => {
  const id = Number(request.params.id);
  reviewService
    .getGamescore(id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});
// Post review goes here! TODO -> Add gamescore func to then.
router.post('/review/', (request, response) => {
  const data = request.body;
  if (
    data &&
    data.review_title.length != 0 &&
    data.review_text.length != 0 &&
    data.review_created_by.length != 0 &&
    data.game_id.length != 0
  ) {
    reviewService
      .postReview(data.review_title, data.review_text, data.created_by, data.game_id)
      .then((id) => response.send(id))
      .catch((error) =>
        response.status(500).send('An unexpected error occurred. Culd not post to Database.')
      );
  } else response.status(400).send('An unexpected error occurred.');
});

router.get('/reviews/:id', (request, response) => {
  const id = Number(request.params.id);
  reviewService
    .getReviews(id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

export default router;
