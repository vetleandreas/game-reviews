import axios from 'axios';
import pool from '../mysql-pool';
import app from '../src/app';
import reviewService, {
  ReviewGamescore,
  GameReviews,
  ReviewUser,
  UpvoteReview,
} from '../src/review-service';
