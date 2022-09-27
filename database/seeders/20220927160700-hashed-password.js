// @ts-check

const { genSalt, hash } = require("bcryptjs")

/**
 * @type {(import("sequelize").Attributes<import("../models/user")>)}
 * @const
 */
const rawUser = {
	"email": "admin@example.com",
	"password": "admin@example"
}

module.exports = {
	/**
	 * @param {import("sequelize").QueryInterface} queryInterface
	 * @param {import("sequelize").Sequelize} unusedSequelize
	 */
	async up(queryInterface, unusedSequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				// @ts-ignore
				const salt = await genSalt(Number(process.env.SECURITY_HASH_SALT_ROUNDS || "10"))
				// @ts-ignore
				const hashedPassword = await hash(rawUser.password, salt)
				// @ts-ignore
				await queryInterface.bulkUpdate(
					"Users",
					{
						"password": hashedPassword
					},
					{
						// @ts-ignore
						"email": rawUser.email
					},
					{ transaction }
				)

				console.log("Updated hashed password: ", hashedPassword)
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	},

	/**
	 * @param {import("sequelize").QueryInterface} queryInterface
	 * @param {import("sequelize").Sequelize} unusedSequelize
	 */
	async down(queryInterface, unusedSequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				// @ts-ignore
				await queryInterface.bulkUpdate(
					"Users",
					{
						"password": rawUser.password
					},
					{
						// @ts-ignore
						"email": rawUser.email
					},
					{ transaction }
				)

				console.log("Reverted password: ", rawUser.password)
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
