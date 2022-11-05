import Semester from "%/models/semester"
import SemesterFactory from "~/factories/semester"

import siftBySlug from "./sift_by_slug"

describe("Database Pipe: Sift by slug", () => {
	it("can find all", async() => {
		const semester = await new SemesterFactory().insertOne()
		const slug = ""

		const options = siftBySlug({}, { "filter": { slug } })
		const foundSemesters = await Semester.findAll(options)

		expect(options).not.toHaveProperty("include")
		expect(foundSemesters).toHaveLength(1)
		expect(foundSemesters).toHaveProperty("0.id", semester.id)
	})

	it("can find on specific using name", async() => {
		const semester = await new SemesterFactory()
		.name(() => "firstsemester")
		.insertOne()
		await new SemesterFactory()
		.name(() => "secondsemester")
		.insertOne()
		const slug = "fir"

		const options = siftBySlug({}, { "filter": { slug } })
		const foundSemesters = await Semester.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundSemesters).toHaveLength(1)
		expect(foundSemesters).toHaveProperty("0.id", semester.id)
	})

	it("cannot find on incorrect slug", async() => {
		await new SemesterFactory()
		.name(() => "firstsemester")
		.insertOne()
		await new SemesterFactory()
		.name(() => "secondsemester")
		.insertOne()
		const slug = "xx"

		const options = siftBySlug({}, { "filter": { slug } })
		const foundSemesters = await Semester.findAll(options)

		expect(options).toHaveProperty("where")
		expect(foundSemesters).toHaveLength(0)
	})
})
