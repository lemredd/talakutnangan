import { Sequelize, DataTypes } from "sequelize"

export default function() {
	const configuration = useRuntimeConfig()

	console.info(configuration.database.URI)

	const database = new Sequelize(configuration.database.URI)

	const User = database.define("User", {
		email: DataTypes.STRING
	})

	User.sync()

	return {
		database,
		User
	}
}
