import "reflect-metadata"
import Database from "./database"

beforeAll(async() => {
	await Database.create()
}, 10000)

afterAll(async() => {
	await Database.destroy()
})

afterEach(async() => {
	await Database.clear()
})
