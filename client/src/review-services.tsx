import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000/api/v1';

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
  getUpvotes() {
    return axios.get('/review/upvote/').then((response) => response.data);
  }
  // Upvotes review with given id
  upvoteReview(userId: number, reviewId: number, upvote: number) {
    return axios
      .post('/review/upvote/', { userId: userId, reviewId: reviewId, upvote: upvote })
      .then((response) => response.data);
  }
  // Get Gamescore with given id
  gameScores(id: number) {
    return axios.get<ReviewGamescore[]>('/review/score/' + id).then((response) => response.data);
  }
  addGame() {
    return axios.post('/game/add');
  }

  postReview(
    review_title: string,
    review_name: string,
    review_text: string,
    review_created_by: string,
    game_id: number,
    game_score: number,
    password: string
  ) {
    return axios
      .post('/review/', {
        review_title: review_title,
        review_name: review_name,
        review_text: review_text,
        review_created_by: review_created_by,
        game_id: game_id,
        game_score: game_score,
        password: password,
      })
      .then((response) => response.data);
  }

  updateReview(
    review_title: string,
    review_text: string,
    review_id: number,
    game_id: number,
    review_score: number,
    review_created_by: string,
    review_password: string
  ) {
    return axios
      .put('/review/', {
        review_title,
        review_text,
        review_id,
        game_id,
        review_score,
        review_created_by,
        review_password,
      })
      .then((response) => response.data);
  }

  deleteReview(review_id: number, review_created_by: string, review_password: string) {
    return axios
      .delete('/review/', {
        data: {
          review_id: review_id,
          review_created_by: review_created_by,
          review_password: review_password,
        },
      })
      .then((response) => response.data);
  }
  gameReviews(id: number) {
    return axios.get<GameReviews[]>('/reviews/' + id).then((response) => response.data);
  }
}

const reviewService = new ReviewService();
export default reviewService;
