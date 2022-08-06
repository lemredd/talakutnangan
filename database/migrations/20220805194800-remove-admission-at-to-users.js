"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.removeColumn("Users", "admittedAt", { transaction });
			} catch (err) {
				await transaction.rollback();
				throw err;
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.addColumn(
					"Users",
					"admittedAt",
					{
						type: Sequelize.DATE,
						allowNull: true,
						defaultValue: null
					},
					{ transaction }
				);
			} catch (err) {
				await transaction.rollback();
				throw err;
			}
		});
	}
};
