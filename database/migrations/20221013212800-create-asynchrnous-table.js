/* eslint-disable vue/sort-keys */

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				const HASH_LENGTH = 64
				await queryInterface.createTable("AsynchronousRequests", {
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
							"model": "Posts",
							"key": "id"
						},
						"onDelete": "cascade",
						"onUpdate": "cascade"
					},
					"token": {
						"allowNull": false,
						"type": Sequelize.STRING(HASH_LENGTH)
					},
					"currentStep": {
						"allowNull": false,
						"type": Sequelize.INTEGER
					},
					"maxStep": {
						"allowNull": false,
						"type": Sequelize.INTEGER
					},
					"isRunning": {
						"allowNull": false,
						"type": Sequelize.BOOLEAN
					},
					"fileContents": {
						"type": Sequelize.BLOB,
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
				}, { transaction })

				await queryInterface.addConstraint("AsynchronousRequests", {
					"fields": [ "bodyHash" ],
					"type": "unique",
					"name": "unique_key_body_hash_constraint",
					transaction
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
				await queryInterface.dropTable("AsynchronousRequests", { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
