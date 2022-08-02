import type { FieldRules } from "!/types/validation"
import { UserKindValues, UserKind } from "$/types/database"
import type { PreprocessedRequest, Request, Response } from "!/types/dependent"
import type { OptionalMiddleware, NewUserNotificationArguments } from "!/types/independent"
import type {
	RawBulkData,
	RawBulkDataForStudent,
	RawBulkDataForEmployee
} from "%/types/independent"

import extractEmailUsername from "$!/helpers/extract_email_username"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Middleware from "!/bases/middleware"
import CSVParser from "!/middlewares/body_parser/csv"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import MultipartController from "!/common_controllers/multipart_controller"

import BodyValidation from "!/validation/body"
import { IMPORT_USERS } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

import array from "!/validators/base/array"
import buffer from "!/validators/base/buffer"
import required from "!/validators/base/required"
import oneOf from "!/validators/comparison/one-of"

export default class extends MultipartController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			IMPORT_USERS
		])
	}

	get postParseMiddlewares(): OptionalMiddleware[] {
		// TODO: Think of the maximum size of the CSV file. currently accepting 1MB.
		const maxSize = 1*1000
		return [
			new BodyValidation((request: Request): FieldRules => ({
				importedCSV: {
					pipes: [ required, buffer ],
					constraints: {
						buffer: {
							allowedMimeTypes: [ "text/csv" ],
							maxSize
						}
					}
				}
			})),
			new CSVParser("importedCSV")
		]
	}

	makeBodyRuleGenerator(request: Request): FieldRules {
		return {
			importCSV: {
				pipes: [ required ],
				constraints: { }
			},
			roles: {
				pipes: [ required, array ],
				constraints: { }
			},
			kind: {
				pipes: [ required, oneOf ],
				constraints: {
					oneOf: {
						values: [ UserKindValues ]
					}
				}
			}
		}
	}

	async handle(
		request: PreprocessedRequest<NewUserNotificationArguments>,
		response: Response
	): Promise<void> {
		Log.trace("controller", "entered POST /api/user/import")

		const manager = new UserManager(request.transaction, request.cache)
		const body: Partial<RawBulkData> = request.body

		Log.trace("controller", "made user manager")

		body.importedCSV = body.importedCSV!.map(data => {
			// ! If there is a change below, update `$!/helpers/make_default_password` too.
			if (body.kind! === "student") {
				data.password = (data as RawBulkDataForStudent).studentNumber
			} else {
				const email = (data as RawBulkDataForEmployee).email
				data.password = extractEmailUsername(email)
			}
			return data
		})

		Log.trace("controller", "generated default passwords")

		const createdModels = await manager.bulkCreate(body as RawBulkData)

		Log.success("controller", "created users in bulk")

		const userDetails = body.importedCSV.map(data => {
			return {
				name: data.name,
				email: data.email,
				kind: body.kind as UserKind,
				password: data.password
			}
		})
		request.nextMiddlewareArguments = { userDetails }

		Log.success("controller", "prepared data to inform new users")

		response.status(this.status.OK).json(createdModels)

		Log.trace("controller", "exiting POST /api/user/import")
	}

	get postJobs(): Middleware[] {
		return [
			CommonMiddlewareList.newUserNotification
		]
	}
}
