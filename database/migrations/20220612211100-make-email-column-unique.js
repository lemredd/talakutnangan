/* eslint-disable vue/sort-keys */

module.exports = {
	async up(queryInterface, unusedSequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.addConstraint("Users", {
					"fields": [ "email" ],
					"type": "unique",
					"name": "unique_key_email_constraint",
					transaction
				})
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	},
	async down(queryInterface, unusedSequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.removeConstraint(
					"Users",
					"unique_key_email_constraint",
					{ transaction }
				)
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
