'use strict'

const connectToDatabase = require('./db')
const errorResponse = require('./util').errorResponse
const successResponse = require('./util').successResponse

function HTTPError(statusCode, message) {
	const error = new Error(message)
	error.statusCode = statusCode
	return error
}

module.exports.create = async (event) => {
	try {
		const { Product } = await connectToDatabase()
		const input = JSON.parse(event.body)

		const product = await Product.create(input)

		return successResponse(product)
	} catch (err) {
		console.log(err)
		return errorResponse(err.statusCode, err.message || 'Could not create the product.')
	}
}

module.exports.getOne = async (event) => {
	try {
		const { Product } = await connectToDatabase()
		const product = await Product.findByPk(event.pathParameters.id)

		if (!product) throw new HTTPError(404, `Product with id: ${event.pathParameters.id} was not found`)

		return successResponse(product)
	} catch (err) {
		console.log(err)
		return errorResponse(err.statusCode, err.message || 'Could not fetch the product.')
	}
}

module.exports.getAll = async () => {
	try {
		const { Product } = await connectToDatabase()
		const products = await Product.findAll()

		return successResponse(products)
	} catch (err) {
		console.log(err)
		return errorResponse(err.statusCode, err.message || 'Could not fetch the products.')
	}
}

module.exports.update = async (event) => {
	try {
		const input = JSON.parse(event.body)
		const { Product } = await connectToDatabase()
		const product = await Product.findByPk(event.pathParameters.id)

		if (!product) throw new HTTPError(404, `Product with id: ${event.pathParameters.id} was not found`)
		if (input.name) product.name = input.name
		if (input.description) product.description = input.description
		if (input.pictures) product.pictures = input.pictures
		if (input.amount) product.amount = input.amount
		if (input.quantity) product.quantity = input.quantity
		if (input.published) product.published = input.published

		await product.save()

		return successResponse(product)
	} catch (err) {
		console.log(err)
		return errorResponse(err.statusCode, err.message || 'Could not update the product.')
	}
}

module.exports.destroy = async (event) => {
	try {
		const { Product } = await connectToDatabase()
		const product = await Product.findByPk(event.pathParameters.id)

		if (!product) throw new HTTPError(404, `Product with id: ${event.pathParameters.id} was not found`)

		await product.destroy()

		return successResponse(product)
	} catch (err) {
		console.log(err)
		return errorResponse(err.statusCode, err.message || 'Could not destroy the product.')
	}
}