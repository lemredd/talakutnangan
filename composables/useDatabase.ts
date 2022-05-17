import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize"

export default function() {
	console.info(process.env.DATABASE_URI)

	const database = new Sequelize(process.env.DATABASE_URI)

	class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
		declare email: string
	}

	User.init({
		email: DataTypes.STRING
	}, { sequelize: database })
	User.sync()

	return {
		database,
		User
	}
}
