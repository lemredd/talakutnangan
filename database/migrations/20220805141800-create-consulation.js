module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.createTable("Consultations", {
					"id": {
						"allowNull": false,
						"autoIncrement": true,
						"primaryKey": true,
						"type": Sequelize.BIGINT
					},
					"attachedRoleID": {
						"allowNull": false,
						"type": Sequelize.BIGINT,
						"references": {
							"model": "AttachedRoles",
							"key": "id"
						},
						"onDelete": "cascade",
						"onUpdate": "cascade"
					},
					"reason": {
						"allowNull": false,
						"type": Sequelize.STRING
					},
					"actionTaken": {
						"allowNull": true,
						"defaultValue": null,
						"type": Sequelize.TEXT
					},
					"scheduledStartAt": {
						"allowNull": false,
						"type": Sequelize.DATE
					},
					"startedAt": {
						"allowNull": true,
						"defaultValue": null,
						"type": Sequelize.DATE
					},
					"finishedAt": {
						"allowNull": true,
						"defaultValue": null,
						"type": Sequelize.DATE
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
				}, { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	},
	async down(queryInterface, unusedSequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.dropTable("Consultations", { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
