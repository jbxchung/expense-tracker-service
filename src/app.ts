import express from 'express';
import cors from 'cors';
import { accessLog } from './middlewares/accessLog';
import { errorHandler } from './middlewares/errorHandler';

import accountRoutes from './routes/account.route';
import categoryRoutes from './routes/category.route';
import pluginRoutes from './routes/plugin.route';
import statementRoutes from './routes/statement.route';
import userRoutes from './routes/user.route';

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173'],
}

app.use(express.json());
app.use(cors(corsOptions));
app.use(accessLog);

// routes
app.use('/accounts', accountRoutes);
app.use('/categories', categoryRoutes);
app.use('/plugins', pluginRoutes);
app.use('/statements', statementRoutes);
app.use('/users', userRoutes);

// global error handler
app.use(errorHandler);

export default app;