/* eslint-disable vue/sort-keys */

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Departments", {
			"id": {
				"allowNull": false,
				"autoIncrement": true,
				"primaryKey": true,
				"type": Sequelize.BIGINT
			},
			"acronym": {
				"allowNull": false,
				"type": Sequelize.STRING
			},
			"fullName": {
				"allowNull": false,
				"unique": true,
				"type": Sequelize.STRING
			},
			"mayAdmit": {
				"allowNull": false,
				"type": Sequelize.BOOLEAN
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
		})
	},
	async down(queryInterface, unusedSequelize) {
		await queryInterface.dropTable("Departments")
	}
}
