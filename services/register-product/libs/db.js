'use strict'

const Sequelize = require('sequelize')
const UserModel = require('../models/User')
const VendorModel = require('../models/Vendor')
const ProductModel = require('../models/Product')
const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		dialect: 'postgres',
		host: process.env.DB_HOST,
		port: process.env.DB_PORT
	}
)

const User = UserModel(sequelize, Sequelize)
const Vendor = VendorModel(sequelize, Sequelize)
const Product = ProductModel(sequelize, Sequelize)

User.hasMany(Product, {foreignKey: 'userId', as: 'vendors'})
Vendor.belongsTo(User, {foreignKey: 'userId'})

User.hasMany(Product, {foreignKey: 'userId', as: 'products'})
Product.belongsTo(User, {foreignKey: 'userId'})

const Models = { User, Vendor, Product }
const connection = {}

module.exports = async () => {
	if (connection.isConnected) {
		console.log('=> Using existing connection.')
		return Models
	}

	await sequelize.sync()
	await sequelize.authenticate()
	connection.isConnected = true
	console.log('=> Created a new connection.')
	return Models
}