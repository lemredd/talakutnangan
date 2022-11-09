/* eslint-disable vue/sort-keys */

module.exports = {
	async up(queryInterface, unusedSequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.dropTable("ProfanityFilters", { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.createTable("ProfanityFilters", {
					"id": {
						"allowNull": false,
						"autoIncrement": true,
						"primaryKey": true,
						"type": Sequelize.BIGINT
					},
					"word": {
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
				}, { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
