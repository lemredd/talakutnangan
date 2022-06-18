"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.addConstraint("Users", {
					fields: [ "email" ],
					type: "unique",
					name: "unique_key_email_constraint",
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
					"unique_key_email_constraint",
					{ transaction }
				);
			} catch (err) {
				await transaction.rollback();
				throw err;
			}
		});
	}
};
