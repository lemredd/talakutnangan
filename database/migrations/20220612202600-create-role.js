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
			department_flags: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			role_flags: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			semester_flags: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			tag_flags: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			post_flags: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			comment_flags: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			profanity_flags: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			user_flags: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			audit_trail_flags: {
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
