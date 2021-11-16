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

  // Get reviews of game with given game_id
  getReviews(gameId: number) {
    return new Promise((resolve, reject) => {
      // pool.query('SELECT * FROM game_review WHERE game_id = ?', [gameId], (error, results) => {
      pool.query(
        'SELECT game_review.id, game_review.review_title, game_review.created_at, game_review.review_text, game_review.created_by_id, game_review.game_id, gamescore.score_id, gamescore.game_id, gamescore.score FROM game_review INNER JOIN gamescore ON game_review.id = gamescore.score_id WHERE game_review.game_id = ?',
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
