import { resolveConfig } from 'prettier';
import pool from '../mysql-pool';

export type ReviewGamescore = {
  id: number;
  scoreId: number;
  gameId: number;
  score: number;
};
export type GameReviews = {
  id: number;
  reviewTitle: string;
  created_at: string;
  review_text: string;
  created_by_id: number;
  gameId: number;
};
export type ReviewUser = {
  id: number;
  userId: number;
  loginId: number;
  admin: boolean;
};
export type UpvoteReview = {
  id: number;
  user_id: number;
  review_id: number;
  upvote: number;
};

class ReviewService {
  // Get all reviews with given id
  // getGamescore(gameId: number) {
  //   return new Promise<ReviewGamescore[]>((resolve, reject) => {
  //     pool.query('SELECT * FROM gamescore WHERE game_id = ?', [gameId], (error, results) => {
  //       if (error) return reject(error);

  //       resolve(results);
  //     });
  //   });
  // }

  // Post upvote on review
  upvoteReview(userId: number, reviewId: number, upvote: number) {
    return new Promise((resolve, reject) => {
      // pool.query('INSERT INTO game_review_relevance (id, user_id, review_id, upvote) VALUES (NULL, 123456789123456789, 1, 1)');
      pool.query(
        'INSERT INTO game_review_relevance (id, user_id, review_id, upvote) VALUES (NULL, ?, ?, ?)',
        [userId, reviewId, upvote],
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
  }
  getUpvotes() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM game_review_relevance', (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
  }
  // Updated Upvote
  upvoteReviewUpdate(relevanceId: number) {
    return new Promise((resolve, reject) => {
      pool.query(
        // 'INSERT INTO game_review_relevance (id, user_id, review_id, upvote) VALUES (NULL, ?, ?, ?)',
        'UPDATE game_review_relevance SET upvote = 0 WHERE id = ?',
        [relevanceId],
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
  }
  // Post review
  postReview(
    review_title: string,
    review_text: string,
    review_created_by: string,
    game_id: number,
    review_password: string
  ) {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO game_review (id, review_title, created_at, review_text, created_by_id, game_id, review_password) VALUES (NULL, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?);',
        [review_title, review_text, review_created_by, game_id, review_password],
        (error, results) => {
          if (error) return reject(error);

          return resolve(results.insertId);
        }
      );
    });
  }
  editReview(
    review_id: number,
    review_title: string,
    review_text: string,
    review_score: number,
    review_password: string
  ) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE gamescore, game_review SET game_review.review_title = ?, game_review.review_text = ?, gamescore.score = ? WHERE game_review.id = ? AND gamescore.score_id = ? AND game_review.review_password = ?',
        [review_title, review_text, review_score, review_id, review_id, review_password],
        (error, results) => {
          if (error) return reject(error);
          if (!results.affectedRows) reject(new Error('No row deleted'));

          return resolve(results);
        }
      );
    });
  }
  deleteReview(review_id: number, review_password: string) {
    return new Promise<void>((resolve, reject) => {
      // Delete sql-query. Drops from game_review and gamescore
      // SQL-query OK!
      pool.query(
        'DELETE game_review, gamescore FROM game_review INNER JOIN gamescore ON game_review.id = gamescore.score_id WHERE game_review.id = ? AND game_review.review_password = ?',
        [review_id, review_password],
        (error, results) => {
          if (error) return reject(error);
          if (!results.affectedRows) reject(new Error('No row deleted'));
          return resolve(results);
        }
      );
    });
  }

  postReviewScore(score_id: number, game_id: number, score: number) {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO gamescore (id, score_id, game_id, score) VALUES (NULL, ?, ?, ?)',
        [score_id, game_id, score],
        (error, results) => {
          if (error) return reject(error);
          return resolve(results);
        }
      );
    });
  }

  // Get reviews of game with given game_id
  getReviews(gameId: number) {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT game_review.id, game_review.review_title, game_review.created_at, game_review.review_text, game_review.created_by_id, game_review.game_id, gamescore.score_id, gamescore.game_id, gamescore.score FROM game_review INNER JOIN gamescore ON game_review.id = gamescore.score_id WHERE game_review.game_id = ? ORDER BY game_review.id DESC',
        [gameId],
        (error, results) => {
          if (error) return reject(error);

          return resolve(results);
        }
      );
    });
  }
  // Get mean score of game with given game_id
  getGamescore(gameId: number) {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT AVG(score) FROM gamescore WHERE game_id = ?',
        [gameId],
        (error, results) => {
          if (error) return reject(error);
          if (results[0]['AVG(score)'] == null)
            return reject({ Error: 'There is no score available for this game.' });
          resolve(results);
        }
      );
    });
  }
}

const reviewService = new ReviewService();
export default reviewService;
