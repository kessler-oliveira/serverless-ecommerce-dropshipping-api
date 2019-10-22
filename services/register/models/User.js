module.exports = (sequelize, type) => {
	return sequelize.define('user', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		name: {
			type: type.TEXT,
			allowNull: false
		},
		email: {
			type: type.TEXT,
			allowNull: false,
			unique: true
		},
		password: {
			type: type.TEXT,
			allowNull: false
		},
		role: {
			type: type.ENUM('CLIENT', 'EXTERNAL', 'VENDOR', 'ADMIN'),
			allowNull: false
		}
	})
}