"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.renameColumn(
					"Consultations",
					"scheduledStartDatetime",
					"scheduledStartAt",
					{ transaction }
				)
				await queryInterface.renameColumn(
					"Consultations",
					"endDatetime",
					"endedAt",
					{ transaction }
				)
				await queryInterface.addColumn(
					"Consultations",
					"startedAt",
					{
						"allowNull": true,
						"type": Sequelize.DATE,
						"defaultValue": null
					},
					{ transaction }
				)
			} catch (err) {
				await transaction.rollback();
				throw err;
			}
		});
	},
	async down(queryInterface, unusedSequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.renameColumn(
					"Consultations",
					"scheduledStartAt",
					"scheduledStartDatetime",
					{ transaction }
				)
				await queryInterface.renameColumn(
					"Consultations",
					"endedAt",
					"endDatetime",
					{ transaction }
				)
				await queryInterface.removeColumn("Consultations", "startedAt", { transaction });
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
};
