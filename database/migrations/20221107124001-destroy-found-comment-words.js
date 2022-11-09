/* eslint-disable vue/sort-keys */

module.exports = {
	async up(queryInterface, unusedSequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.dropTable("FoundCommentWords", { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.createTable("FoundCommentWords", {
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
					"profanityFilterID": {
						"allowNull": false,
						"type": Sequelize.BIGINT,
						"references": {
							"model": "ProfanityFilters",
							"key": "id"
						},
						"onDelete": "cascade",
						"onUpdate": "cascade"
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
	}
}
