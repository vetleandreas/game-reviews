import express, { request, response } from 'express';
import reviewService from './review-service';
import { sha256 } from 'js-sha256';

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
    data.game_score != undefined &&
    data.game_score.length != 0 &&
    data.review_title != undefined &&
    data.review_title.length != 0 &&
    data.review_text != undefined &&
    data.review_text.length != 0 &&
    data.review_created_by != undefined &&
    data.review_created_by.length != 0 &&
    data.game_id != undefined &&
    data.game_id.length != 0 &&
    data.password != undefined &&
    data.password.length != 0
  ) {
    data.game_score > 10
      ? (data.game_score = 10)
      : data.game_score < 1
      ? (data.game_score = 1)
      : data.game_score;
    reviewService
      .postReview(
        data.review_title,
        data.review_text,
        data.review_created_by,
        data.game_id,
        sha256(String(data.review_created_by) + String(data.password))
      )
      .then((id) => {
        reviewService
          // @ts-ignore
          .postReviewScore(id, data.game_id, data.game_score)
          .then()
          .catch((error) => response.status(500).send('An unexpected error occurred.'));
        response.send({ id: id });
      })
      .catch((error) => response.status(500).send('An unexpected error occurred.'));
  } else response.status(400).send('An unexpected error occurred.');
});
// Update review
router.put('/review/', (request, response) => {
  const data = request.body;
  if (
    data &&
    data.review_title != undefined &&
    data.review_title.length != 0 &&
    data.review_text != undefined &&
    data.review_text.length != 0 &&
    data.review_id != undefined &&
    data.review_id.length != 0 &&
    data.game_id != undefined &&
    data.game_id.length != 0 &&
    data.review_score != undefined &&
    data.review_score.length != 0 &&
    data.review_created_by != undefined &&
    data.review_created_by.length != 0
  ) {
    // data.review_score < 1 ? (data.review_score = 1) : data.review_score;
    // data.review_score > 10 ? (data.review_score = 10) : data.review_score;

    data.review_score > 10
      ? (data.review_score = 10)
      : data.review_score < 1
      ? (data.review_score = 1)
      : data.review_score;

    reviewService
      .editReview(
        data.review_id,
        data.review_title,
        data.review_text,
        data.review_score,
        sha256(String(data.review_created_by) + String(data.review_password))
      )
      .then((_result) => response.send())
      .catch((error) => response.status(500).send('An unexpected error occurred.'));
  } else response.status(400).send('An unexpected error occurred.');
});

router.delete('/review/', (request, response) => {
  const data = request.body;
  if (
    data &&
    data.review_id != undefined &&
    data.review_id.length != 0 &&
    data.review_created_by != undefined &&
    data.review_created_by.length != 0 &&
    data.review_password != undefined &&
    data.review_password.length != 0
  ) {
    reviewService
      .deleteReview(
        data.review_id,
        sha256(String(data.review_created_by) + String(data.review_password))
      )
      .then((_result) => response.send())
      .catch((error) => response.status(500).send('An unexpected error occurred.'));
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
