import { ValidationError } from "yup";

interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(error: ValidationError): Errors {
  const validateErrors: Errors = {};

  error.inner.forEach((err) => {
    validateErrors[err.path] = err.message;
  });

  return validateErrors;
}
