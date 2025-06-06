import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  kind?: string; // For Mongoose ObjectId errors
  errors?: any; // For Mongoose validation errors
  value?: any; // For Mongoose CastError
  code?: number; // For duplicate key errors (e.g. MongoDB E11000)
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error: CustomError = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = `Resource not found with id of ${err.value}`;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((val: any) => val.message);
    message = messages.join(', ');
  }

  // Mongoose Duplicate Key Error (code E11000)
  if (err.code === 11000) {
    statusCode = 400;
    // Extract field name from error message if possible (can be complex)
    // Example: E11000 duplicate key error collection: inesPlatform.users index: email_1 dup key: { email: "test@example.com" }
    const field = Object.keys( (err as any).keyValue )[0];
    message = `Duplicate field value entered for '${field}'. Please use another value.`;
  }

  // Custom operational errors might have statusCode set
  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  res.status(statusCode || 500).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    errorName: process.env.NODE_ENV === 'production' ? undefined : err.name,
    errorCode: process.env.NODE_ENV === 'production' ? undefined : err.code,
  });
};
