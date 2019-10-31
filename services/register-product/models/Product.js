'use strict'

module.exports = (sequelize, type) => {
	return sequelize.define('product', {
		id: {
			type: type.UUID,
			defaultValue: type.UUIDV4,
			primaryKey: true,
			allowNull: false
		},
		userId: {
			type: type.UUID,
			defaultValue: type.UUIDV4,
			primaryKey: true,
			allowNull: false
		},
		name: {
			type: type.TEXT,
			allowNull: false
		},
		description: {
			type: type.TEXT,
			allowNull: false
		},
		pictures: {
			type: type.ARRAY(type.TEXT),
			allowNull: false
		},
		amount: {
			type: type.DECIMAL(10,2),
			allowNull: false
		},
		quantity: {
			type: type.INTEGER,
			allowNull: false
		},
		published: {
			type: type.BOOLEAN,
			allowNull: false
		}
	})
}