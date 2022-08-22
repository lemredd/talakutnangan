module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.createTable("AuditTrails", {
					"id": {
						"allowNull": false,
						"autoIncrement": true,
						"primaryKey": true,
						"type": Sequelize.BIGINT
					},
					"userID": {
						"allowNull": true,
						"defaultValue": null,
						"type": Sequelize.BIGINT,
						"references": {
							"model": "Users",
							"key": "id"
						},
						"onDelete": "cascade",
						"onUpdate": "cascade"
					},
					"actionName": {
						"type": Sequelize.STRING,
						"allowNull": false
					},
					"extra": {
						"type": Sequelize.JSON,
						"allowNull": false
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
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	},
	async down(queryInterface, unusedSequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.dropTable("AuditTrails", { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
