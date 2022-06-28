// @ts-check
"use strict";

/**
 * @type {(import("sequelize").Attributes<import("../models/department")>)[]}
 * @const
 */
const rawDepartments = [
	{
		fullName: "Institute of Arts, Sciences, and Teacher Education",
		acronym: "IASTE",
		mayAdmit: true
	},
	{
		fullName: "Institute of Business and Computing Education",
		acronym: "IBCE",
		mayAdmit: true
	},
	{
		fullName: "Institute of Hospitality and Tourism Managment",
		acronym: "IHTM",
		mayAdmit: true
	},
	{
		fullName: "Student Affairs and Support Services",
		acronym: "SASS",
		mayAdmit: false
	}
]

module.exports = {
	/**
	 * @param {import("sequelize").QueryInterface} queryInterface
	 * @param {import("sequelize").Sequelize} Sequelize
	 */
	async up (queryInterface, Sequelize) {
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
	 * @param {import("sequelize").Sequelize} Sequelize
	 */
	async down (queryInterface, Sequelize) {
		const departments = rawDepartments
		// @ts-ignore
		const departmentNames = departments.map(department => department.fullName)

		await queryInterface.bulkDelete("Departments", {
			fullName: departmentNames
		}, {})
		console.log("Deleted: ", departmentNames)
	}
};
