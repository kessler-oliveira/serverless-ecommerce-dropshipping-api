'use strict'

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs-then')

const connectToDatabase = require('../libs/db')
const errorResponse = require('../libs/utils').errorResponse
const successResponse = require('../libs/utils').successResponse

function HTTPError(statusCode, message) {
	const error = new Error(message)
	error.statusCode = statusCode
	return error
}

module.exports.login = async (event) => {
	try {
		const { User } = await connectToDatabase()
        const input = JSON.parse(event.body)
        
        const user = await User.findOne({ where: {email: input.email} })
        if (!user) throw new HTTPError(400, 'User with that email does not exits.')

        const authentication = await bcrypt.compare(input.password, user.password)
        if (!authentication) throw new HTTPError(400, 'The credentials do not match.')
		
		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME })

		return successResponse({ token: token })
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message)
	}
}