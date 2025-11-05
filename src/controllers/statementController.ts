import { Request, Response, NextFunction } from 'express';
import { statements, Statement } from '../models/statement';

// Create an item
export const uploadStatement = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;


    const newItem: Statement = { id: 'hash', filename: '', account: '', uploadDate: new Date() };
    statements.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
};

// Read all statements
export const getStatements = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(statements);
  } catch (error) {
    next(error);
  }
};

// Read single item
export const getStatementById = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const item = statements.find((i) => i.id === id);
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};


// Delete a statement
export const deleteStatement = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const itemIndex = statements.findIndex((i) => i.id === id);
    if (itemIndex === -1) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    // todo - delete from filesystem
    const deletedItem = statements.splice(itemIndex, 1)[0];
    res.json(deletedItem);
  } catch (error) {
    next(error);
  }
};