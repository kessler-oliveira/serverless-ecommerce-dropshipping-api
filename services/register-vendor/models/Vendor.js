'use strict'

module.exports = (sequelize, type) => {
	return sequelize.define('vendor', {
		userId: {
			type: type.UUID,
			defaultValue: type.UUIDV4,
			primaryKey: true,
			allowNull: false
		}
	})
}