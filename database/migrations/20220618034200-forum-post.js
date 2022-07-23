"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Posts", {
			//title, desc, badword, user id, role id
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			title: {
				allowNull: false,
				type: Sequelize.STRING
			},
			desc: {
				allowNull: false,
				type: Sequelize.STRING
			},
			badWordExist: {
				allowNull: false,
				type: Sequelize.BOOLEAN
			},
			userID: {
				allowNull: false,
				type: Sequelize.BIGINT,
				references: {
					model: "Users",
					key: "id"
				},
				onDelete: "cascade",
				onUpdate: "cascade"
			},
			roleID: {
				allowNull: false,
				type: Sequelize.BIGINT,
				references: {
					model: "Roles",
					key: "id"
				},
				onDelete: "cascade",
				onUpdate: "cascade"
			},
			//
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
		await queryInterface.dropTable("Posts")
	}
}
