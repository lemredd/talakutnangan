import MockRequester from "~/set-ups/mock_requester"

import CSVParser from "./csv"

describe("Middleware: CSV Form Data Transformation", () => {
	const requester = new MockRequester()

	it("can parse body properly", async () => {
		const parser = new CSVParser("importedCSV")
		const rawBody = [
			'﻿Student Number,Name,Email,Department',
			'1920-111,Juan Dela Cruz,j.delacruz20111@mcc.edu.ph,IBCE',
			'1920-112,Alice Garcia,a.garcia20112@mcc.edu.ph,IASTE',
			'1920-113,Bob Marquis,n.marquis20113@mcc.edu.ph,IHTM',
		].join("\r\n")
		requester.customizeRequest({
			body: {
				importedCSV: {
					buffer: Buffer.from(rawBody)
				}
			}
		})

		await requester.runMiddleware(parser.intermediate.bind(parser))

		const successfulRequest = requester.expectSuccess()
		expect(successfulRequest.body).toHaveProperty([ "importedCSV", 0, "Department" ], "IBCE")
		expect(successfulRequest.body).toHaveProperty([ "importedCSV", 1, "Department" ], "IASTE")
		expect(successfulRequest.body).toHaveProperty([ "importedCSV", 2, "Department" ], "IHTM")
	})

	it.todo("cannot process invalid body")
})
