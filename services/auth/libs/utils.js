'use strict'

const errorResponse = (statusCode, message) => ({
	statusCode: statusCode || 500,
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ 'message': message || 'Internal server error' }),
});

const successResponse = (body) => ({
	statusCode: 200,
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify(body)
});

module.exports = {
	errorResponse,
	successResponse
};