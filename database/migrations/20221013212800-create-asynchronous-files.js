/* eslint-disable vue/sort-keys */

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				const HASH_LENGTH = 64
				await queryInterface.createTable("AsynchronousFiles", {
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
					"origin": {
						"allowNull": false,
						"type": Sequelize.STRING
					},
					"token": {
						"allowNull": false,
						"type": Sequelize.STRING(HASH_LENGTH)
					},
					"finishedStepCount": {
						"allowNull": false,
						"type": Sequelize.INTEGER
					},
					"totalStepCount": {
						"allowNull": false,
						"type": Sequelize.INTEGER
					},
					"hasStopped": {
						"allowNull": false,
						"type": Sequelize.BOOLEAN
					},
					"extra": {
						"allowNull": false,
						"type": Sequelize.JSON
					},
					"fileContents": {
						"allowNull": true,
						"defaultValue": null,
						"type": Sequelize.BLOB
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

				await queryInterface.addConstraint("AsynchronousFiles", {
					"fields": [ "origin", "token" ],
					"type": "unique",
					"name": "unique_key_origin_token_constraint",
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
				await queryInterface.dropTable("AsynchronousFiles", { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
