module.exports.errorResponse = errorResponse = (statusCode, message) => ({
  statusCode: statusCode || 500,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 'message': (message || 'Internal server error') }),
});

module.exports.sucessResponse = sucessResponse = (body) => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});