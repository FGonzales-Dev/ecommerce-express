import { Error } from 'mongoose';

export interface ErrorResponse {
  status: number;
  message: string;
  details?: any;
}

export const createErrorResponse = (status: number, message: string, details?: any): ErrorResponse => {
  return {
    status,
    message,
    details,
  };
};

export const handleValidationError = (err: Error.ValidationError): ErrorResponse => {
  const errors = Object.values(err.errors).map((error) => error.message);
  return createErrorResponse(400, 'Validation Error', errors);
};