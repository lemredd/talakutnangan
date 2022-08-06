"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.sequelize.transaction(async transaction => {
			try {
				await queryInterface.createTable("ProfilePictures", {
					id: {
						allowNull: false,
						autoIncrement: true,
						primaryKey: true,
						type: Sequelize.BIGINT
					},
					userID: {
						allowNull: false,
						type: Sequelize.BIGINT,
						references: {
							model: "Users",
							key: "id"
						},
						onDelete: "cascade",
						onUpdate: "cascade"
					},
					file: {
						type: Sequelize.BLOB,
						allowNull: true,
						defaultValue: null
					},
					createdAt: {
						allowNull: false,
						type: Sequelize.DATE
					},
					updatedAt: {
						allowNull: false,
						type: Sequelize.DATE
					},
					deletedAt: {
						allowNull: true,
						type: Sequelize.DATE
					}
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
				await queryInterface.dropTable("ProfilePictures", { transaction });
			} catch (err) {
				await transaction.rollback();
				throw err;
			}
		});
	}
};
