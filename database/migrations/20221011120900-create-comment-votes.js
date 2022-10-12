/* eslint-disable vue/sort-keys */

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.dropTable("CommentVotes", { transaction })
				await queryInterface.createTable("CommentVotes", {
					"id": {
						"allowNull": false,
						"autoIncrement": true,
						"primaryKey": true,
						"type": Sequelize.BIGINT
					},
					"commentID": {
						"allowNull": false,
						"type": Sequelize.BIGINT,
						"references": {
							"model": "Comments",
							"key": "id"
						},
						"onDelete": "cascade",
						"onUpdate": "cascade"
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
					"kind": {
						"allowNull": false,
						"type": Sequelize.ENUM([ "upvote", "downvote" ])
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
				await queryInterface.dropTable("CommentVotes", { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
