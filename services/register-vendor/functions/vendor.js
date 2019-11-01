'use strict'

const connectToDatabase = require('../libs/db')
const errorResponse = require('../libs/utils').errorResponse
const successResponse = require('../libs/utils').successResponse

function HTTPError(statusCode, message) {
	const error = new Error(message)
	error.statusCode = statusCode
	return error
}

module.exports.adminAllow = async (event) => {
	try {
		console.log(JSON.stringify(event))

		const { Vendor } = await connectToDatabase()
		const vendor = await Vendor.findByPk(event.pathParameters.id)
		
		if (vendor) throw new HTTPError(400, `Vendor with id: ${event.pathParameters.id} already exists`)

		const result = await Vendor.create({ userId: event.pathParameters.id })

		return successResponse(result)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not create the vendor.')
	}
}

module.exports.adminDeny = async (event) => {
	try {
		console.log(JSON.stringify(event))

		const { Vendor } = await connectToDatabase()
		const vendor = await Vendor.findByPk(event.pathParameters.id)

		if (!vendor) throw new HTTPError(404, `Vendor with id: ${event.pathParameters.id} was not found`)

		await vendor.destroy()

		return successResponse(vendor)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not destroy the vendor.')
	}
}

module.exports.adminGet = async (event) => {
	try {
		console.log(JSON.stringify(event))

		const { Vendor } = await connectToDatabase()
		const vendor = await Vendor.findByPk(event.pathParameters.id)

		if (!vendor) throw new HTTPError(404, `Vendor with id: ${event.pathParameters.id} was not found`)

		return successResponse(vendor)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not fetch the vendor.')
	}
}

module.exports.adminGetAll = async (event) => {
	try {
		console.log(JSON.stringify(event))
		
		const { Vendor } = await connectToDatabase()
		const vendor = await Vendor.findAll()

		return successResponse(vendor)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not fetch the vendors.')
	}
}
