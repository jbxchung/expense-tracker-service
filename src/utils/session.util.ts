import { Request } from 'express';
import { User } from '@prisma/client';

export async function saveSession(req: Request, user: User): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    req.session.userId = user.id;
    req.session.save(err => (err ? reject(err) : resolve()));
  });
}

export function destroySession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.destroy(err => {
      if (err) return reject(err);
      resolve();
    });
  });
}
