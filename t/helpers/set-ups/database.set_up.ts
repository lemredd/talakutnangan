import "reflect-metadata"
import Database from "./database"

beforeAll(async() => {
	await Database.create()
}, Number(process.env.DATABASE_SETUP_TIMEOUT) || 10000)

afterAll(async() => {
	await Database.destroy()
}, Number(process.env.DATABASE_SETUP_TIMEOUT) || 10000)

afterEach(async() => {
	await Database.clear()
}, Number(process.env.DATABASE_SETUP_TIMEOUT) || 10000)
