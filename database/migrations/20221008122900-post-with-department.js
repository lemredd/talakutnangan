/* eslint-disable vue/sort-keys */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.addColumn(
					"Posts",
					"departmentID",
					{
						"defaultValue": null,
						"allowNull": true,
						"onDelete": "cascade",
						"onUpdate": "cascade",
						"references": {
							"key": "id",
							"model": "Departments"
						},
						"type": Sequelize.BIGINT
					},
					{ transaction }
				)
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	},
	async down(queryInterface, unusedSequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.removeColumn(
					"Posts",
					"departmentID",
					{ transaction }
				)
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
