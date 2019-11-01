'use strict'

const connectToDatabase = require('../libs/db')
const errorResponse = require('../libs/utils').errorResponse
const successResponse = require('../libs/utils').successResponse

function HTTPError(statusCode, message) {
	const error = new Error(message)
	error.statusCode = statusCode
	return error
}

module.exports.vendorCreate = async (event) => {
	try {
		console.log(JSON.stringify(event))

		const { Product, Vendor } = await connectToDatabase()
		const id = event.requestContext.authorizer.principalId
		const vendor = await Vendor.findByPk(id)

		if (!vendor) throw new HTTPError(403, `User is not authorized to access this resource with an explicit deny`)

		const input = JSON.parse(event.body)

		input.userId = id
		input.published = false

		const product = await Product.create(input)

		return successResponse(product)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not create the product.')
	}
}

module.exports.adminCreate = async (event) => {
	try {
		console.log(JSON.stringify(event))

		const { Product } = await connectToDatabase()
		const input = JSON.parse(event.body)

		const product = await Product.create(input)

		return successResponse(product)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not create the product.')
	}
}

module.exports.getPublished = async (event) => {
	try {
		console.log(JSON.stringify(event))

		const { Product } = await connectToDatabase()
		const product = await Product.findByPk(event.pathParameters.id)

		if (!product) throw new HTTPError(404, `Product with id: ${event.pathParameters.id} was not found`)

		if (!product.published) throw new HTTPError(404, `Product with id: ${event.pathParameters.id} was not published`)

		return successResponse(product)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not fetch the product.')
	}
}

module.exports.getAllPublished = async (event) => {
	try {
		console.log(JSON.stringify(event))

		const { Product } = await connectToDatabase()
		const products = await Product.findAll({ where: {published: true} })

		return successResponse(products)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not fetch the products.')
	}
}

module.exports.vendorGet = async (event) => {
	try {
		console.log(JSON.stringify(event))

		const { Product, Vendor } = await connectToDatabase()

		const id = event.requestContext.authorizer.principalId
		const vendor = await Vendor.findByPk(id)

		if (!vendor) throw new HTTPError(403, `User is not authorized to access this resource with an explicit deny`)

		const product = await Product.findByPk(event.pathParameters.id)

		if (!product) throw new HTTPError(404, `Product with id: ${event.pathParameters.id} was not found`)

		if (product.userId != id) throw new HTTPError(403, `User is not authorized to access this resource with an explicit deny`)

		return successResponse(product)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not fetch the product.')
	}
}

module.exports.vendorGetAll = async (event) => {
	try {
		console.log(JSON.stringify(event))

		const { Product, Vendor } = await connectToDatabase()

		const id = event.requestContext.authorizer.principalId
		const vendor = await Vendor.findByPk(id)

		if (!vendor) throw new HTTPError(403, `User is not authorized to access this resource with an explicit deny`)

		const products = await Product.findAll({ where: {userId: id} })

		return successResponse(products)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not fetch the products.')
	}
}

module.exports.adminGet = async (event) => {
	try {
		console.log(JSON.stringify(event))

		const { Product } = await connectToDatabase()
		const product = await Product.findByPk(event.pathParameters.id)

		if (!product) throw new HTTPError(404, `Product with id: ${event.pathParameters.id} was not found`)

		return successResponse(product)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not fetch the product.')
	}
}

module.exports.adminGetAll = async (event) => {
	try {
		console.log(JSON.stringify(event))

		const { Product } = await connectToDatabase()
		const products = await Product.findAll()

		return successResponse(products)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not fetch the products.')
	}
}

module.exports.vendorUpdate = async (event) => {
	try {
		console.log(JSON.stringify(event))

		const input = JSON.parse(event.body)
		const { Product, Vendor } = await connectToDatabase()

		const id = event.requestContext.authorizer.principalId
		const vendor = await Vendor.findByPk(id)

		if (!vendor) throw new HTTPError(403, `User is not authorized to access this resource with an explicit deny`)

		const product = await Product.findByPk(event.pathParameters.id)

		if (!product) throw new HTTPError(404, `Product with id: ${event.pathParameters.id} was not found`)

		if (product.userId != id) throw new HTTPError(403, `User is not authorized to access this resource with an explicit deny`)

		if ('name' in input) product.name = input.name
		if ('description' in input) product.description = input.description
		if ('pictures' in input) product.pictures = input.pictures
		if ('amount' in input) product.amount = input.amount
		if ('quantity' in input) product.quantity = input.quantity

		product.published = false

		await product.save()

		return successResponse(product)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not update the product.')
	}
}

module.exports.adminUpdate = async (event) => {
	try {
		console.log(JSON.stringify(event))

		const input = JSON.parse(event.body)
		const { Product } = await connectToDatabase()
		const product = await Product.findByPk(event.pathParameters.id)

		if (!product) throw new HTTPError(404, `Product with id: ${event.pathParameters.id} was not found`)

		if ('userId' in input) product.userId = input.userId
		if ('name' in input) product.name = input.name
		if ('description' in input) product.description = input.description
		if ('pictures' in input) product.pictures = input.pictures
		if ('amount' in input) product.amount = input.amount
		if ('quantity' in input) product.quantity = input.quantity
		if ('published' in input) product.published = input.published

		await product.save()

		return successResponse(product)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not update the product.')
	}
}

module.exports.vendorDestroy = async (event) => {
	try {
		console.log(JSON.stringify(event))

		const { Product, Vendor } = await connectToDatabase()

		const id = event.requestContext.authorizer.principalId
		const vendor = await Vendor.findByPk(id)

		if (!vendor) throw new HTTPError(403, `User is not authorized to access this resource with an explicit deny`)

		const product = await Product.findByPk(event.pathParameters.id)

		if (!product) throw new HTTPError(404, `Product with id: ${event.pathParameters.id} was not found`)

		if (product.userId != id) throw new HTTPError(403, `User is not authorized to access this resource with an explicit deny`)

		await product.destroy()

		return successResponse(product)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not destroy the product.')
	}
}

module.exports.adminDestroy = async (event) => {
	try {
		console.log(JSON.stringify(event))
		
		const { Product } = await connectToDatabase()
		const product = await Product.findByPk(event.pathParameters.id)

		if (!product) throw new HTTPError(404, `Product with id: ${event.pathParameters.id} was not found`)

		await product.destroy()

		return successResponse(product)
	} catch (err) {
		console.log(JSON.stringify(err))
		return errorResponse(err.statusCode, err.message || 'Could not destroy the product.')
	}
}