import { days } from "../../shareable/types/database.native"

"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.createTable("EmployeeSchedules", {
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: Sequelize.BIGINT
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
					scheduleStart: {
						allowNull: false,
						type: Sequelize.INTEGER
					},
					scheduleEnd: {
						allowNull: false,
						type: Sequelize.INTEGER
					},
					dayName: {
						allowNull: false,
						type: Sequelize.ENUM(days)
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
				}, { transaction });
			} catch (err) {
				await transaction.rollback();
				throw err;
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("EmployeeSchedules");
	}
};
