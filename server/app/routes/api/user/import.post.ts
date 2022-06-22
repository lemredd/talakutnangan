import { Buffer } from "buffer"

import { OptionalMiddleware } from "$/types/server"
import { Request, Response } from "!/types/dependent"
import { RawBulkData, RawBulkDataForStudent, RawBulkDataForEmployee } from "%/types/independent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Middleware from "!/bases/middleware"
import CSVParser from "!/middlewares/body_parser/csv"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import MultipartController from "!/common_controllers/multipart_controller"

 export interface WithImport {
	body: {
		importedCSV: Buffer
	}
}

export default class extends MultipartController {
	get filePath(): string { return __filename }

	// TODO: Use a permission-based policy
	get policy(): Policy { return CommonMiddlewareList.knownOnlyPolicy }

	get postParseMiddlewares(): OptionalMiddleware[] {
		return [
			new CSVParser("importedCSV")
		]
	}

	get bodyValidationRules(): object {
		// TODO: Create validator for buffers
		return {
			importedCSV: [ "required" ]
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const manager = new UserManager()
		const body: Partial<RawBulkData> = request.body

		body.importedCSV = body.importedCSV!.map(data => {
			if (body.kind! === "student") {
				data.password = (data as RawBulkDataForStudent).studentNumber
			} else {
				// TODO: Think of a way to produce password for employees
				data.password = (data as RawBulkDataForEmployee).email
			}
			return data
		})

		const createdModels = await manager.bulkCreate(body as RawBulkData)

		response.status(this.status.OK).json(createdModels)
	}

	// TODO: Send e-mails to new users
	get postJobs(): Middleware[] {
		return []
	}
}
