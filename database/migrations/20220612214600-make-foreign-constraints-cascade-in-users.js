"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.removeConstraint(
					"Users",
					"foreign_key_department_id_constraint",
					{ transaction }
				);

				await queryInterface.addConstraint("Users", {
					fields: [ "departmentID" ],
					type: "foreign key",
					name: "foreign_key_department_id_constraint",
					references: {
						table: "Departments",
						field: "id"
					},
					onDelete: "cascade",
					onUpdate: "cascade",
					transaction
				});
			} catch (err) {
				await transaction.rollback();
				throw err;
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.removeConstraint(
					"Users",
					"foreign_key_department_id_constraint",
					{ transaction }
				);

				await queryInterface.addConstraint("Users", {
					fields: [ "departmentID" ],
					type: "foreign key",
					name: "foreign_key_department_id_constraint",
					references: {
						table: "Departments",
						field: "id"
					},
					onDelete: "cascade",
					onUpdate: "no action",
					transaction
				});
			} catch (err) {
				await transaction.rollback();
				throw err;
			}
		});
	}
};
