import KindManager from "./manager"

describe("Resource management: Kind manager", () => {
	it("can detect admin user", () => {
		const kind = "admin"

		const manager = new KindManager(kind)

		expect(manager.isAdmin()).toBeTruthy()
		expect(manager.isInstituteLimited()).toBeFalsy()
		expect(manager.isStudentServiceLimited()).toBeFalsy()
	})

	it("can detect institute-limited user", () => {
		const kind = "secretary"

		const manager = new KindManager(kind)

		expect(manager.isAdmin()).toBeFalsy()
		expect(manager.isInstituteLimited()).toBeTruthy()
		expect(manager.isStudentServiceLimited()).toBeFalsy()
	})

	it("can detect service-limited user", () => {
		const kind = "service"

		const manager = new KindManager(kind)

		expect(manager.isAdmin()).toBeFalsy()
		expect(manager.isInstituteLimited()).toBeFalsy()
		expect(manager.isStudentServiceLimited()).toBeTruthy()
	})
})
