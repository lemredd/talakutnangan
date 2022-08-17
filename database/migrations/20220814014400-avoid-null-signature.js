"use strict"
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.changeColumn(
					"Signatures",
					"fileContents",
					{
						type: Sequelize.BLOB,
						allowNull: false
					},
					{ transaction }
				)
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.changeColumn(
					"Signatures",
					"fileContents",
					{
						type: Sequelize.BLOB,
						allowNull: true
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
