// @ts-check
"use strict";

import { readFile } from "fs"
import { promisify } from "util"

const initialRoles = promisify(readFile)("./initial_roles.json")

module.exports = {
	/**
	 * @param {import("sequelize").QueryInterface} queryInterface
	 * @param {import("sequelize").Sequelize} Sequelize
	 */
	async up (queryInterface, Sequelize) {
		// TODO: Automatically generate the roles
		/**
		 * @type {(import("sequelize").Attributes<import("../models/role")>)[]}
		 * @const
		 */
		const roles = [
			{
				name: "admin",
				departmentFlags: 0x10F,
				roleFlags: 0x0F,
				semesterFlags: 0x0F,
				tagFlags: 0x0F,
				postFlags: 0x1FF,
				commentFlags: 0xFD,
				profanityFlags: 0x3F,
				userFlags: 0x1FF,
				auditTrailFlags: 0x1
			},
			{
				name: "dean",
				departmentFlags: 0x05,
				roleFlags: 0x01,
				semesterFlags: 0x01,
				tagFlags: 0x0F,
				postFlags: 0x1AF,
				commentFlags: 0x1AF,
				profanityFlags: 0x11,
				userFlags: 0x0AF,
				auditTrailFlags: 0x0
			}
		]

		roles.forEach(role => {
			// @ts-ignore
			role.createdAt = new Date()
			// @ts-ignore
			role.updatedAt = new Date()
		})
		// @ts-ignore
		// await queryInterface.bulkInsert("Roles", roles, {});
		console.log(await initialRoles)
	},

	/**
	 * @param {import("sequelize").QueryInterface} queryInterface
	 * @param {import("sequelize").Sequelize} Sequelize
	 */
	async down (queryInterface, Sequelize) {
		// TODO
	}
};
