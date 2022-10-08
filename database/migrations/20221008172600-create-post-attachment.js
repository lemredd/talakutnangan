/* eslint-disable vue/sort-keys */

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.createTable("PostAttachments", {
					"id": {
						"allowNull": false,
						"autoIncrement": true,
						"primaryKey": true,
						"type": Sequelize.BIGINT
					},
					"postID": {
						"allowNull": true,
						"defaultValue": null,
						"onDelete": "cascade",
						"onUpdate": "cascade",
						"references": {
							"key": "id",
							"model": "Posts"
						},
						"type": Sequelize.BIGINT
					},
					"fileContents": {
						"allowNull": false,
						"type": Sequelize.BLOB
					},
					"fileType": {
						"allowNull": false,
						"type": Sequelize.STRING
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
				await queryInterface.dropTable("PostAttachments", { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
