// @ts-check
"use strict";

const { resolve } = require("path")
const { readFile } = require("fs")
const { promisify } = require("util")

const initialRoles = promisify(readFile)(resolve(__dirname, "initial_roles.json"))

module.exports = {
	/**
	 * @param {import("sequelize").QueryInterface} queryInterface
	 * @param {import("sequelize").Sequelize} Sequelize
	 */
	async up (queryInterface, Sequelize) {
		/**
		 * @type {(import("sequelize").Attributes<import("../models/role")>)[]}
		 * @const
		 */
		const roles = JSON.parse((await initialRoles).toString()).data

		roles.forEach(role => {
			// @ts-ignore
			role.createdAt = new Date()
			// @ts-ignore
			role.updatedAt = new Date()
		})
		// @ts-ignore
		await queryInterface.bulkInsert("Roles", roles, {})
		console.log("Inserted: ", roles)
	},

	/**
	 * @param {import("sequelize").QueryInterface} queryInterface
	 * @param {import("sequelize").Sequelize} Sequelize
	 */
	async down (queryInterface, Sequelize) {
		/**
		 * @type {(import("sequelize").Attributes<import("../models/role")>)[]}
		 * @const
		 */
		const roles = JSON.parse((await initialRoles).toString()).data
		// @ts-ignore
		const roleNames = roles.map(role => role.name)

		await queryInterface.bulkDelete("Roles", {
			name: roleNames
		}, {})
		console.log("Deleted: ", roleNames)
	}
};
