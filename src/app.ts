import express from 'express';
import cors from 'cors';
import { accessLog } from './middlewares/accessLog';
import { errorHandler } from './middlewares/errorHandler';

import accountRoutes from './routes/account.route';
import statementRoutes from './routes/statementRoutes';

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173'],
}

app.use(express.json());
app.use(cors(corsOptions));
app.use(accessLog);

// Routes
app.use('/accounts', accountRoutes);
app.use('/statements', statementRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;