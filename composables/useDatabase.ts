import "reflect-metadata"
import { DataSource } from "typeorm"
import User from "~/server/model/user"

const dataSource = new DataSource({
	type: "mysql",
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT as unknown as number,
	database: process.env.DATABASE_NAME,
	username: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASS,
	entities: [
		User
	],
	synchronize: true,
	logging: true
})

await dataSource.initialize()

export default async function() {
	const manager = dataSource.manager

	return {
		manager,
		User
	}
}
