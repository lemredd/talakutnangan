"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Users", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING
			},
			email: {
				allowNull: false,
				type: Sequelize.STRING
			},
			password: {
				allowNull: false,
				type: Sequelize.STRING
			},
			kind: {
				allowNull: false,
				type: Sequelize.ENUM([ "unreachable_employee", "reachable_employee", "student" ])
			},
			emailVerifiedAt: {
				allowNull: true,
				type: Sequelize.STRING
			},
			admittedAt: {
				allowNull: true,
				type: Sequelize.STRING
			},
			signature: {
				type: Sequelize.BLOB
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
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Users")
	}
}
