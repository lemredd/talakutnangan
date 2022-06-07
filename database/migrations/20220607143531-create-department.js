"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
	 	await queryInterface.createTable("Departments", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			acronym: {
				allowNull: false,
				type: Sequelize.STRING
			},
			fullName: {
				allowNull: false,
				type: Sequelize.STRING
			},
			mayAdmit: {
				allowNull: false,
				type: Sequelize.BOOLEAN
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			deletedAt: {
				allowNull: true,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Departments");
	}
};
