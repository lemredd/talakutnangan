/* eslint-disable vue/sort-keys */

module.exports = {
	async up(queryInterface, unusedSequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.dropTable("FoundPostWords", { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.createTable("FoundPostWords", {
					"id": {
						"allowNull": false,
						"autoIncrement": true,
						"primaryKey": true,
						"type": Sequelize.BIGINT
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
