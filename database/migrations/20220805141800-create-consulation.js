"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.createTable("Consultations", {
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: Sequelize.BIGINT
					},
					attachedRoleID: {
						allowNull: false,
						type: Sequelize.BIGINT,
						references: {
							model: "AttachedRoles",
							key: "id"
						},
						onDelete: "cascade",
						onUpdate: "cascade"
					},
					reason: {
						allowNull: false,
						type: Sequelize.TEXT
					},
					status: {
						allowNull: false,
						type: Sequelize.ENUM([ "will_start", "ongoing", "done" ])
					},
					actionTaken: {
						allowNull: false,
						type: Sequelize.TEXT
					},
					scheduledStartDatetime: {
						allowNull: false,
						type: Sequelize.DATE
					},
					endDatetime: {
						allowNull: true,
						type: Sequelize.DATE,
						defaultValue: null
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
		await queryInterface.dropTable("Consultations");
	}
};
