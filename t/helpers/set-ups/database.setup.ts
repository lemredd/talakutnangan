import "reflect-metadata"

import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import Database from "./database"

beforeAll(async() => {
	await Database.create()
}, Number(process.env.DATABASE_SETUP_TIMEOUT) || convertTimeToMilliseconds("00:00:10"))

afterAll(async() => {
	await Database.destroy()
}, Number(process.env.DATABASE_SETUP_TIMEOUT) || convertTimeToMilliseconds("00:00:10"))

afterEach(async() => {
	await Database.clear()
}, Number(process.env.DATABASE_SETUP_TIMEOUT) || convertTimeToMilliseconds("00:00:10"))
