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
  gameReviews(id: number) {
    return axios.get<GameReviews[]>('/reviews/' + id).then((response) => response.data);
  }
}

const reviewService = new ReviewService();
export default reviewService;
