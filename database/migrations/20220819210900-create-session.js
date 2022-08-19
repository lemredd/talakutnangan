module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.createTable("Sessions", {
					"sid": {
						"allowNull": false,
						"primaryKey": true,
						"type": Sequelize.STRING
					},
					"data": {
						"allowNull": false,
						"type": Sequelize.TEXT
					},
					"expires": {
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
				await queryInterface.dropTable("Sessions", { transaction })
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
