const { days } = require("../../shareable/types/database.native")

"use strict"

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.removeColumn("Users", "signature")
				await queryInterface.createTable("Signatures", {
					"id": {
						"allowNull": false,
						"autoIncrement": true,
						"primaryKey": true,
						"type": Sequelize.BIGINT
					},
					"userID": {
						"allowNull": false,
						"type": Sequelize.BIGINT,
						"references": {
							"model": "Users",
							"key": "id"
						},
						"onDelete": "cascade",
						"onUpdate": "cascade"
					},
					"signature": {
						"type": Sequelize.BLOB,
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
				}, { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.addColumn(
					"Users",
					"signature",
					{
						"type": Sequelize.BLOB,
						"allowNull": true,
						"defaultValue": null
					},
					{ transaction }
				)

				await queryInterface.dropTable("Signatures", { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
