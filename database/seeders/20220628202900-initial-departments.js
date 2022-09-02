// @ts-check

/**
 * @type {(import("sequelize").Attributes<import("../models/department")>)[]}
 * @const
 */
const rawDepartments = [
	{
		"acronym": "IASTE",
		"fullName": "Institute of Arts, Sciences, and Teacher Education",
		"mayAdmit": true
	},
	{
		"acronym": "IBCE",
		"fullName": "Institute of Business and Computing Education",
		"mayAdmit": true
	},
	{
		"acronym": "IHTM",
		"fullName": "Institute of Hospitality and Tourism Managment",
		"mayAdmit": true
	},
	{
		"acronym": "SASS",
		"fullName": "Student Affairs and Support Services",
		"mayAdmit": false
	}
]

module.exports = {
	/**
	 * @param {import("sequelize").QueryInterface} queryInterface
	 * @param {import("sequelize").Sequelize} unusedSequelize
	 */
	async up(queryInterface, unusedSequelize) {
		const departments = rawDepartments

		departments.forEach(department => {
			// @ts-ignore
			department.createdAt = new Date()
			// @ts-ignore
			department.updatedAt = new Date()
		})

		// @ts-ignore
		await queryInterface.bulkInsert("Departments", departments, {})
		console.log("Inserted: ", departments)
	},

	/**
	 * @param {import("sequelize").QueryInterface} queryInterface
	 * @param {import("sequelize").Sequelize} unusedSequelize
	 */
	async down(queryInterface, unusedSequelize) {
		const departments = rawDepartments
		// @ts-ignore
		const departmentNames = departments.map(department => department.fullName)

		await queryInterface.bulkDelete("Departments", {
			"fullName": departmentNames
		}, {})
		console.log("Deleted: ", departmentNames)
	}
}
