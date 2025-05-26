// utils/responseHandler.js

function success(res, statusCode, message, data = null) {
  return res.status(statusCode).json({
    status: 'success',
    code: statusCode,
    message,
    data,
  });
}

function error(res, statusCode, message) {
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message,
  });
}

module.exports = {
  success,
  error,
};
