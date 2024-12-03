const errorCodes = {
  SUCCESS: {code: 200, message: 'Success'},
  CREATED: {code: 201, message: 'Resource created successfully'},
  BAD_REQUEST: {code: 400, message: 'Bad Request'},
  UNAUTHORIZED: {code: 401, message: 'User Unauthorized'},
  NOT_FOUND: {code: 404, message: 'Resource not found'},
  VALIDATION_ERROR: {code: 422, message: 'Validation Error'},
  INTERNAL_SERVER_ERROR: {code: 500, message: 'Internal Server Error'}
};

function getErrorDetails(errorCode, customMessage = '') {
  const error = errorCodes[errorCode];
  if (!error) {
    throw new Error(`Error code "${errorCode}" not found`);
  }

  return {
    ...error,
    message: `${error.message}${customMessage ? `: ${customMessage}` : ''}`
  };
}

export default getErrorDetails;