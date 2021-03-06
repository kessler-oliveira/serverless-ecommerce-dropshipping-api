'use strict'

const bcrypt = require('bcryptjs-then')

const connectToDatabase = require('../libs/db')
const errorResponse = require('../libs/utils').errorResponse
const successResponse = require('../libs/utils').successResponse

function HTTPError(statusCode, message) {
	const error = new Error(message)
	error.statusCode = statusCode
	return error
}

module.exports.create = async (event) => {
	try {
		console.log(JSON.stringify(event))

		const { User } = await connectToDatabase()
		const input = JSON.parse(event.body)
		
		const email = await User.findOne({ where: {email: input.email} })
		if (email) throw new HTTPError(400, `User with email: ${input.email} already exists`)

		input.password = await bcrypt.hash(input.password, 8)

		const user = await User.create(input)

		return successResponse(user)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not create the user.')
	}
}

module.exports.selfGet = async (event) => {
	try {
		console.log(JSON.stringify(event))

		const { User } = await connectToDatabase()
		const id = event.requestContext.authorizer.principalId
		const user = await User.findByPk(id)

		if (!user) throw new HTTPError(404, `User with id: ${id} was not found`)

		return successResponse(user)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not fetch the user.')
	}
}

module.exports.adminGet = async (event) => {
	try {
		console.log(JSON.stringify(event));

		const { User } = await connectToDatabase()
		const user = await User.findByPk(event.pathParameters.id)

		if (!user) throw new HTTPError(404, `User with id: ${event.pathParameters.id} was not found`)

		return successResponse(user)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not fetch the user.')
	}
}

module.exports.adminGetAll = async (event) => {
	try {
		console.log(JSON.stringify(event));

		const { User } = await connectToDatabase()
		const users = await User.findAll()

		return successResponse(users)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not fetch the users.')
	}
}

module.exports.selfUpdate = async (event) => {
	try {
		console.log(JSON.stringify(event));

		const input = JSON.parse(event.body)
		const { User } = await connectToDatabase()
		const id = event.requestContext.authorizer.principalId
		const user = await User.findByPk(id)

		if (!user) throw new HTTPError(404, `User with id: ${id} was not found`)
		if (input.name) user.name = input.name
		if (input.email) user.email = input.email
		if (input.password) user.password = await bcrypt.hash(input.password, 8)

		await user.save()

		return successResponse(user)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not update the user.')
	}
}

module.exports.adminUpdate = async (event) => {
	try {
		console.log(JSON.stringify(event));

		const input = JSON.parse(event.body)
		const { User } = await connectToDatabase()
		const user = await User.findByPk(event.pathParameters.id)

		if (!user) throw new HTTPError(404, `User with id: ${event.pathParameters.id} was not found`)
		if (input.role) user.role = input.role

		await user.save()

		return successResponse(user)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not update the user.')
	}
}

module.exports.selfDestroy = async (event) => {
	try {
		console.log(JSON.stringify(event));

		const { User } = await connectToDatabase()
		const id = event.requestContext.authorizer.principalId
		const user = await User.findByPk(id)

		if (!user) throw new HTTPError(404, `User with id: ${id} was not found`)

		await user.destroy()

		return successResponse(user)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not destroy the user.')
	}
}

module.exports.adminDestroy = async (event) => {
	try {
		console.log(JSON.stringify(event));
		
		const { User } = await connectToDatabase()
		const user = await User.findByPk(event.pathParameters.id)

		if (!user) throw new HTTPError(404, `User with id: ${event.pathParameters.id} was not found`)

		await user.destroy()

		return successResponse(user)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not destroy the user.')
	}
}