// @ts-check

/**
 * @type {(import("sequelize").Attributes<import("../models/department")>)}
 * @const
 */
const rawDepartment = {
	"acronym": "ACD",
	"fullName": "Administrative Control Department",
	"mayAdmit": true
}

/**
 * @type {(import("sequelize").Attributes<import("../models/user")>)}
 * @const
 */
const rawUser = {
	"email": "admin@example.com",
	"emailVerifiedAt": new Date(),
	"kind": "unreachable_employee",
	"name": "Admin",
	"password": "admin@example",
	"prefersDark": false
}

module.exports = {
	/**
	 * @param {import("sequelize").QueryInterface} queryInterface
	 * @param {import("sequelize").Sequelize} unusedSequelize
	 */
	async up(queryInterface, unusedSequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				const department = rawDepartment
				// @ts-ignore
				department.createdAt = new Date()
				// @ts-ignore
				department.updatedAt = new Date()
				await queryInterface.bulkInsert(
					"Departments",
					// @ts-ignore
					[ department ],
					{ transaction }
				)
				const departmentID = await queryInterface.rawSelect(
					"Departments",
					{
						"where": {
							// @ts-ignore
							"acronym": department.acronym
						},
						transaction
					},
					"id"
				)

				const user = rawUser
				// @ts-ignore
				user.departmentID = departmentID
				// @ts-ignore
				user.createdAt = new Date()
				// @ts-ignore
				user.updatedAt = new Date()
				// @ts-ignore
				await queryInterface.bulkInsert(
					"Users",
					// @ts-ignore
					[ user ],
					{ transaction }
				)
				const userID = await queryInterface.rawSelect(
					"Users",
					{
						"where": {
							// @ts-ignore
							"email": user.email
						},
						transaction
					},
					"id"
				)

				const roleID = await queryInterface.rawSelect(
					"Roles",
					{
						"where": {
							"name": "Admin"
						},
						transaction
					},
					"id"
				)

				await queryInterface.bulkInsert(
					"AttachedRoles",
					// @ts-ignore
					[
						{
							"createdAt": new Date(),
							roleID,
							"updatedAt": new Date(),
							userID
						}
					],
					{ transaction }
				)

				// @ts-ignore
				console.log("Inserted: ", department, user)
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
				const department = rawDepartment

				const user = rawUser
				await queryInterface.bulkDelete("Users", {
					// @ts-ignore
					"email": user.email
				}, { transaction })

				await queryInterface.bulkDelete("Departments", {
					// @ts-ignore
					"acronym": department.acronym
				}, { transaction })

				console.log("Deleted: ", department, user)
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
