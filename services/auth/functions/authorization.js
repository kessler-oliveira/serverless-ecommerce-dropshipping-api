'use strict'

const jwt = require('jsonwebtoken');

const buildIAMPolicy = (userId, effect, resource) => {
	console.log(JSON.stringify(`buildIAMPolicy ${userId} ${effect} ${resource}`))

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
		}
	}

	console.log(JSON.stringify(policy));
	return policy
}

const authorizeUser = (methodArn) => {
	return true;
};

module.exports.handler = async (event, context, callback) => {

	console.log(JSON.stringify(event));
	const token = event.authorizationToken;

	try {
		const decoded = jwt.verify(token.replace(/^Bearer\s/, ''), process.env.JWT_SECRET)
		console.log(JSON.stringify(decoded))

		const userId = decoded.id;
		const isAllowed = authorizeUser(userId, event.methodArn)

		const effect = isAllowed ? 'Allow' : 'Deny'

		callback(null, buildIAMPolicy(userId, effect, event.methodArn))
	} catch (err) {
		console.log(JSON.stringify(err))
		callback('Unauthorized')
	}
}