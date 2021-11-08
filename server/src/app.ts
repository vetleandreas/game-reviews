import express from 'express';
import gameRouter from './game-router';

/**
 * Express application.
 */
const app = express();

app.use(express.json());
app.use('/api/v1', gameRouter);

export default app;
