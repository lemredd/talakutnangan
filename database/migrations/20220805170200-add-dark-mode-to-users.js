"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.addColumn(
					"Users",
					"prefersDark",
					{
						type: Sequelize.BOOLEAN,
						allowNull: false,
						defaultValue: false
					},
					{ transaction }
				);
			} catch (err) {
				await transaction.rollback();
				throw err;
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.removeColumn("Users", "prefersDark", { transaction });
			} catch (err) {
				await transaction.rollback();
				throw err;
			}
		});
	}
};
