/* eslint-disable vue/sort-keys */

module.exports = {
	async up(queryInterface, unusedSequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.removeColumn("Comments", "commentID", { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.addColumn(
					"Comments",
					"commentID",
					{
						"allowNull": true,
						"type": Sequelize.BIGINT,
						"references": {
							"model": "Comments",
							"key": "id"
						},
						"onDelete": "cascade",
						"onUpdate": "cascade"
					},
					{ transaction }
				)
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
