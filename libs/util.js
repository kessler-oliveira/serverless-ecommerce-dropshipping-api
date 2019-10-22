module.exports.errorResponse = errorResponse = (statusCode, message) => ({
	statusCode: statusCode || 500,
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ 'message': message || 'Internal server error' }),
});

module.exports.successResponse = successResponse = (body) => ({
	statusCode: 200,
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify(body)
});

module.exports.httpError = httpError = (statusCode, message) => {
	const error = new Error(message)
	error.statusCode = statusCode
	return error
}