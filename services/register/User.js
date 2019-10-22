'use strict'

const connectToDatabase = require('./db')
const errorResponse = require('./util').errorResponse
const successResponse = require('./util').successResponse
const bcrypt = require('bcryptjs-then')

function HTTPError(statusCode, message) {
	const error = new Error(message)
	error.statusCode = statusCode
	return error
}

module.exports.create = async (event) => {
	try {
		const { User } = await connectToDatabase()
		const input = JSON.parse(event.body)
		
		const email = await User.findOne({ where: {email: input.email} })
		if (email) throw new HTTPError(400, `User with email: ${input.email} already exists`)

		input.password = await bcrypt.hash(input.password, 8)

		const user = await User.create(input)

		return successResponse(user)
	} catch (err) {
		console.log(err)
		return errorResponse(err.statusCode, err.message || 'Could not create the user.')
	}
}

module.exports.getOne = async (event) => {
	try {
		const { User } = await connectToDatabase()
		const user = await User.findByPk(event.pathParameters.id)

		if (!user) throw new HTTPError(404, `User with id: ${event.pathParameters.id} was not found`)

		return successResponse(user)
	} catch (err) {
		console.log(err)
		return errorResponse(err.statusCode, err.message || 'Could not fetch the user.')
	}
}

module.exports.getAll = async () => {
	try {
		const { User } = await connectToDatabase()
		const users = await User.findAll()

		return successResponse(users)
	} catch (err) {
		console.log(err)
		return errorResponse(err.statusCode, err.message || 'Could not fetch the users.')
	}
}

module.exports.update = async (event) => {
	try {
		const input = JSON.parse(event.body)
		const { User } = await connectToDatabase()
		const user = await User.findByPk(event.pathParameters.id)

		if (!user) throw new HTTPError(404, `User with id: ${event.pathParameters.id} was not found`)
		if (input.name) user.name = input.name
		if (input.email) user.email = input.email
		if (input.password) user.password = input.password

		await user.save()

		return successResponse(user)
	} catch (err) {
		console.log(err)
		return errorResponse(err.statusCode, err.message || 'Could not update the user.')
	}
}

module.exports.destroy = async (event) => {
	try {
		const { User } = await connectToDatabase()
		const user = await User.findByPk(event.pathParameters.id)

		if (!user) throw new HTTPError(404, `User with id: ${event.pathParameters.id} was not found`)

		await user.destroy()

		return successResponse(user)
	} catch (err) {
		console.log(err)
		return errorResponse(err.statusCode, err.message || 'Could not destroy the user.')
	}
}