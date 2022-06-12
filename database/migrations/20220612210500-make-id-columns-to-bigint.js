"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.changeColumn(
					"Users",
					"id",
					{
						type: Sequelize.BIGINT,
						allowNull: false
					},
					{ transaction }
				);

				await queryInterface.changeColumn(
					"Departments",
					"id",
					{
						type: Sequelize.BIGINT,
						allowNull: false
					},
					{ transaction }
				);

				await queryInterface.changeColumn(
					"Users",
					"departmentID",
					{
						type: Sequelize.BIGINT,
						allowNull: false
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
				await queryInterface.changeColumn(
					"Users",
					"id",
					{
						type: Sequelize.INTEGER,
						allowNull: false
					},
					{ transaction }
				);

				await queryInterface.changeColumn(
					"Departments",
					"id",
					{
						type: Sequelize.INTEGER,
						allowNull: false
					},
					{ transaction }
				);

				await queryInterface.changeColumn(
					"Users",
					"departmentID",
					{
						type: Sequelize.INTEGER,
						allowNull: false
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
