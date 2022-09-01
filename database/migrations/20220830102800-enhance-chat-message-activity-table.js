module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.changeColumn(
					"ChatMessageActivities",
					"receivedMessageAt",
					{
						"allowNull": true,
						"defaultValue": null,
						"type": Sequelize.DATE
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
					"ChatMessageActivities",
					"receivedMessageAt",
					{
						"allowNull": false,
						"type": Sequelize.DATE
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
