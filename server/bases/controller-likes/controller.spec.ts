import { getMockReq as makeRequest, getMockRes as makeResponse } from "@jest-mock/express"

import Validation from "!/bases/validation"
import { EndHandler } from "!/types/hybrid"
import endRequest from "!/helpers/end_request"
import { RouteInformation } from "!/types/independent"

import Controller from "./controller"

describe("Back-end: Base Controller", () => {
	abstract class BaseTestController extends Controller {
		get filePath(): string { return __filename }

		get endHandler(): EndHandler { return endRequest }

		get policy(): null { return null }

		get bodyParser(): null { return null }

		get validations(): Validation[] { return [] }
	}
})
