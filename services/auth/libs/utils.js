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

const buildIAMPolicy = (userId, effect, resource, context) => {
	console.log(`buildIAMPolicy ${userId} ${effect} ${resource}`);
	const policy = {
		principalId: userId,
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect: effect,
					Resource: resource,
				},
			],
		},
		context,
	};

	console.log(JSON.stringify(policy));
	return policy;
};

module.exports = {
	errorResponse,
	successResponse,
	buildIAMPolicy
};