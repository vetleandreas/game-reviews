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
  // getUpvotes(reviewId: number, userId: number) {
  //   return axios.get('/review/upvote/' + reviewId + '/' + userId).then((response) => response.data);
  // }

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
  // postReview(review_title: string, review_text: string, created_by: number, game_id: number) {
  //   return axios
  //     .post('/review/', {
  //       review_title: review_title,
  //       review_text: review_text,
  //       created_by: created_by,
  //       game_id: game_id,
  //     })
  //     .then((response) => response.data);
  // }
  postReview(
    review_title: string,
    review_text: string,
    review_created_by: number,
    game_id: number,
    game_score: number,
    password: string
  ) {
    return axios
      .post('/review/', {
        review_title: review_title,
        review_text: review_text,
        review_created_by: review_created_by,
        game_id: game_id,
        game_score: game_score,
        password: password,
      })
      .then((response) => response.data);
  }

  /*
        "review_title" : "StringID!",
        "review_text" : "En bowling simulator uten glede.",
        "review_id": "123",
        "game_id" : "149292",
        "review_score":"1",
        "review_created_by":"stefan@mail.mail",
        "review_password":"test254"
  */
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
  gameReviews(id: number) {
    return axios.get<GameReviews[]>('/reviews/' + id).then((response) => response.data);
  }
}

const reviewService = new ReviewService();
export default reviewService;
