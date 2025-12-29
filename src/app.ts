import express from 'express';
import cors from 'cors';
import { accessLog } from './middlewares/accessLog';
import { errorHandler } from './middlewares/errorHandler';
import { sessionMiddleware } from './middlewares/session';

import accountRoutes from './routes/account.route';
import authRoutes from './routes/auth.route';
import categoryRoutes from './routes/category.route';
import importerRoutes from './routes/importer.route';
import transactionRoutes from './routes/transaction.route';
import userRoutes from './routes/user.route';

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173'],
}

// middlewares
app.use(express.json());
app.use(sessionMiddleware);
app.use(cors(corsOptions));
app.use(accessLog);

// routes
app.use('/auth', authRoutes);

app.use('/accounts', accountRoutes);
app.use('/categories', categoryRoutes);
app.use('/importers', importerRoutes);
app.use('/transactions', transactionRoutes);
app.use('/users', userRoutes);

// global error handler
app.use(errorHandler);

export default app;