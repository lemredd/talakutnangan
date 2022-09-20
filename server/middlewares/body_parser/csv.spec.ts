import MockRequester from "~/setups/mock_requester"
import ParserError from "$!/errors/parser"

import CSVParser from "./csv"

describe("Middleware: CSV Form Data Transformation", () => {
	const requester = new MockRequester()

	it("can parse body properly", async() => {
		const parser = new CSVParser("importedCSV")
		const rawBody = [
			"﻿Student Number,Name,Email,Department",
			"1920-111,Juan Dela Cruz,j.delacruz20111@mcc.edu.ph,IBCE",
			"1920-112,Alice Garcia,a.garcia20112@mcc.edu.ph,IASTE",
			"1920-113,Bob Marquis,n.marquis20113@mcc.edu.ph,IHTM"
		].join("\r\n")
		requester.customizeRequest({
			"body": {
				"importedCSV": {
					"buffer": Buffer.from(rawBody)
				}
			}
		})

		await requester.runMiddleware(parser.intermediate.bind(parser))

		const successfulRequest = requester.expectSuccess()
		expect(successfulRequest.body).toHaveProperty("importedCSV.0.department", "IBCE")
		expect(successfulRequest.body).toHaveProperty("importedCSV.1.department", "IASTE")
		expect(successfulRequest.body).toHaveProperty("importedCSV.2.department", "IHTM")
	})

	it("can parse body in deep path properly", async() => {
		const parser = new CSVParser("meta.importedCSV")
		const rawBody = [
			"﻿Student Number,Name,Email,Department",
			"1920-111,Juan Dela Cruz,j.delacruz20111@mcc.edu.ph,IBCE",
			"1920-112,Alice Garcia,a.garcia20112@mcc.edu.ph,IASTE",
			"1920-113,Bob Marquis,n.marquis20113@mcc.edu.ph,IHTM"
		].join("\r\n")
		requester.customizeRequest({
			"body": {
				"meta": {
					"importedCSV": {
						"buffer": Buffer.from(rawBody)
					}
				}
			}
		})

		await requester.runMiddleware(parser.intermediate.bind(parser))

		const successfulRequest = requester.expectSuccess()
		expect(successfulRequest.body).toHaveProperty("meta.importedCSV.0.department", "IBCE")
		expect(successfulRequest.body).toHaveProperty("meta.importedCSV.1.department", "IASTE")
		expect(successfulRequest.body).toHaveProperty("meta.importedCSV.2.department", "IHTM")
	})

	it("cannot process invalid body", async() => {
		const parser = new CSVParser("importedCSV")
		const rawBody = [
			"﻿Student Number,Name,Email,Department",
			"1920-111,Juan Dela Cruz,j.delacruz20111@mcc.edu.ph,IBCE",
			"1920-112,Alice Garcia,a.garcia20112@mcc.edu.phIASTE",
			"1920-113,Bob Marquis,n.marquis20113@mcc.edu.ph,IHTM"
		].join("\r\n")
		requester.customizeRequest({
			"body": {
				"importedCSV": {
					"buffer": Buffer.from(rawBody)
				}
			}
		})

		await requester.runMiddleware(parser.intermediate.bind(parser))

		requester.expectFailure(ParserError)
	})
})
