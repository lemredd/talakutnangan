/* eslint-disable vue/sort-keys */

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.dropTable("Posts", { transaction })
				await queryInterface.createTable("Posts", {
					"id": {
						"allowNull": false,
						"autoIncrement": true,
						"primaryKey": true,
						"type": Sequelize.BIGINT
					},
					"attachedRoleID": {
						"allowNull": false,
						"type": Sequelize.BIGINT,
						"references": {
							"model": "AttachedRoles",
							"key": "id"
						},
						"onDelete": "cascade",
						"onUpdate": "cascade"
					},
					"content": {
						"type": Sequelize.TEXT,
						"allowNull": false
					},
					"approvedAt": {
						"type": Sequelize.DATE,
						"allowNull": false
					},
					"createdAt": {
						"allowNull": false,
						"type": Sequelize.DATE
					},
					"updatedAt": {
						"allowNull": false,
						"type": Sequelize.DATE
					},
					"deletedAt": {
						"allowNull": true,
						"type": Sequelize.DATE
					}
				})
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.dropTable("Posts", { transaction })
				await queryInterface.createTable("Posts", {
					"id": {
						"allowNull": false,
						"autoIncrement": true,
						"primaryKey": true,
						"type": Sequelize.INTEGER
					},
					"title": {
						"allowNull": false,
						"type": Sequelize.STRING
					},
					"desc": {
						"allowNull": false,
						"type": Sequelize.STRING
					},
					"badWordExist": {
						"allowNull": false,
						"type": Sequelize.BOOLEAN
					},
					"userID": {
						"allowNull": false,
						"type": Sequelize.BIGINT,
						"references": {
							"model": "Users",
							"key": "id"
						},
						"onDelete": "cascade",
						"onUpdate": "cascade"
					},
					"roleID": {
						"allowNull": false,
						"type": Sequelize.BIGINT,
						"references": {
							"model": "Roles",
							"key": "id"
						},
						"onDelete": "cascade",
						"onUpdate": "cascade"
					},
					"createdAt": {
						"allowNull": false,
						"type": Sequelize.DATE
					},
					"updatedAt": {
						"allowNull": false,
						"type": Sequelize.DATE
					},
					"deletedAt": {
						"allowNull": true,
						"type": Sequelize.DATE
					}
				})
			} catch (err) {
				await transaction.rollback()
				throw err
			}
		})
	}
}
