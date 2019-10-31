'use strict'

const Sequelize = require('sequelize')
const UserModel = require('../models/User')
const VendorModel = require('../models/Vendor')
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

User.hasMany(Product, {foreignKey: 'userId', as: 'vendors'})
Vendor.belongsTo(User, {foreignKey: 'userId'})

const Models = { User, Vendor }
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