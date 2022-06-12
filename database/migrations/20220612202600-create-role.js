"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
	 	await queryInterface.createTable("Roles", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.BIGINT
			},
			name: {
				allowNull: false,
				unique: true,
				type: Sequelize.STRING
			},
			departmentFlags: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			roleFlags: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			semesterFlags: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			tagFlags: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			postFlags: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			commentFlags: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			profanityFlags: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			userFlags: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			auditTrailFlags: {
				allowNull: false,
				type: Sequelize.INTEGER
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
		await queryInterface.dropTable("Roles");
	}
};
