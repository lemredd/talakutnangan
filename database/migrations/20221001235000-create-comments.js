/* eslint-disable vue/sort-keys */

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.createTable("Comments", {
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
					"postID": {
						"allowNull": false,
						"type": Sequelize.BIGINT,
						"references": {
							"model": "Posts",
							"key": "id"
						},
						"onDelete": "cascade",
						"onUpdate": "cascade"
					},
					"commentID": {
						"allowNull": true,
						"type": Sequelize.BIGINT,
						"references": {
							"model": "Comments",
							"key": "id"
						},
						"onDelete": "cascade",
						"onUpdate": "cascade"
					},
					"content": {
						"type": Sequelize.TEXT,
						"allowNull": false
					},
					"approvedAt": {
						"type": Sequelize.DATE,
						"allowNull": true
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
				await queryInterface.dropTable("Comments", { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
