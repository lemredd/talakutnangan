/* eslint-disable vue/sort-keys */

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.createTable("Semesters", {
					"id": {
						"allowNull": false,
						"autoIncrement": true,
						"primaryKey": true,
						"type": Sequelize.BIGINT
					},
					"name": {
						"allowNull": false,
						"type": Sequelize.STRING
					},
					"semesterOrders": {
						"allowNull": false,
						"type": Sequelize.ENUM([ "first", "second", "third" ])
					},
					"startAt": {
						"allowNull": false,
						"type": Sequelize.DATE
					},
					"endAt": {
						"allowNull": false,
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
				await queryInterface.dropTable("Semesters", { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
