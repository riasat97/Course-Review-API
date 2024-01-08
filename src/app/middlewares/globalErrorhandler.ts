/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import AppError from '../errors/AppError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import handleValidationError from '../errors/handleValidationError';
import handleZodError from '../errors/handleZodError';
import Unauthorized from '../errors/Unauthorized';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessage = '';

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessage = simplifiedError?.errorMessage;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessage = simplifiedError?.errorMessage;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessage = simplifiedError?.errorMessage;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessage = simplifiedError?.errorMessage;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorMessage = err?.message;
  } else if (err instanceof Unauthorized) {
    message = err.message;
    errorMessage =
      'You do not have the necessary permissions to access this resource.';
  } else if (err instanceof Error) {
    message = err.message;
    errorMessage = err?.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails: err instanceof Unauthorized ? null : err,
    stack:
      config.NODE_ENV === 'development'
        ? err instanceof Unauthorized
          ? null
          : err?.stack
        : null,
  });
};

export default globalErrorHandler;
