module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.removeColumn(
					"ChatMessages",
					"userID",
					{ transaction }
				)
				await queryInterface.removeColumn(
					"ChatMessages",
					"consultationID",
					{ transaction }
				)

				await queryInterface.addColumn(
					"ChatMessages",
					"kind",
					{
						"allowNull": false,
						"type": Sequelize.TEXT
					},
					{ transaction }
				)
				await queryInterface.addColumn(
					"ChatMessages",
					"chatMessageActivityID",
					{
						"allowNull": false,
						"type": Sequelize.BIGINT,
						"references": {
							"model": "ChatMessageActivities",
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
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.addColumn(
					"ChatMessages",
					"userID",
					{
						"allowNull": false,
						"type": Sequelize.BIGINT,
						"references": {
							"model": "Users",
							"key": "id"
						},
						"onDelete": "cascade",
						"onUpdate": "cascade"
					},
					{ transaction }
				)
				await queryInterface.addColumn(
					"ChatMessages",
					"consultationID",
					{
						"allowNull": false,
						"type": Sequelize.BIGINT,
						"references": {
							"model": "Consultations",
							"key": "id"
						},
						"onDelete": "cascade",
						"onUpdate": "cascade"
					},
					{ transaction }
				)

				await queryInterface.removeColumn(
					"ChatMessages",
					"kind",
					{ transaction }
				)
				await queryInterface.removeColumn(
					"ChatMessages",
					"chatMessageActivityID",
					{ transaction }
				)
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
