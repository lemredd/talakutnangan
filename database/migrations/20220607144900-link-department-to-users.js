"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			await queryInterface.addColumn(
				"Users",
				"departmentID",
				{
					type: Sequelize.DataTypes.BIGINT
				},
				{ transaction }
			);

			await queryInterface.addConstraint("Users", {
				fields: [ "departmentID" ],
				type: "foreign key",
				name: "department_id_constraint",
				references: {
					table: "Departments",
					field: "id"
				},
				onDelete: "cascade"
			});
			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("Users", "departmentID");
		await queryInterface.removeConstraint("Users", "department_id_constraint");
	}
};
