const Sequelize = require('sequelize')
const UserModel = require('./models/User')
const ProductModel = require('./models/Product')
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
const Product = ProductModel(sequelize, Sequelize)
const Models = { User, Product }
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