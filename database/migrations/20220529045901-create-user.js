
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Users", {
			"id": {
				"allowNull": false,
				"autoIncrement": true,
				"primaryKey": true,
				"type": Sequelize.BIGINT
			},
			"name": {
				"allowNull": false,
				"type": Sequelize.STRING
			},
			"email": {
				"allowNull": false,
				"type": Sequelize.STRING
			},
			"password": {
				"allowNull": false,
				"type": Sequelize.STRING
			},
			"kind": {
				"allowNull": false,
				"type": Sequelize.ENUM([ "unreachable_employee", "reachable_employee", "student" ])
			},
			"emailVerifiedAt": {
				"type": Sequelize.DATE,
				"allowNull": true,
				"defaultValue": null
			},
			"admittedAt": {
				"type": Sequelize.DATE,
				"allowNull": true,
				"defaultValue": null
			},
			"signature": {
				"type": Sequelize.BLOB,
				"allowNull": true,
				"defaultValue": null
			},
			"createdAt": {
				"allowNull": false,
				"type": Sequelize.DATE
			},
			"updatedAt": {
				"allowNull": false,
				"type": Sequelize.DATE
			},
			"deletedAt": {
				"allowNull": true,
				"type": Sequelize.DATE
			}
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Users")
	}
}
