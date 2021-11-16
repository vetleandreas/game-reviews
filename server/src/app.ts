import express from 'express';
import gameRouter from './game-router';
import reviewRouter from './review-router';

/**
 * Express application.
 */
const app = express();

app.use(express.json());
app.use('/api/v1', gameRouter);
app.use('/api/v1', reviewRouter);

export default app;
