import type { SignatureDocument } from "$/types/documents/signature"
import type { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Validation from "!/bases/validation"
import OkResponseInfo from "!/response_infos/ok"
import SignatureManager from "%/managers/signature"
import sniffMediaType from "!/helpers/sniff_media_type"
import Controller from "!/bases/controller-likes/controller"

import {
	READ_OWN,
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"
import IDParameterValidation from "!/validations/id_parameter"
import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"

export default class extends Controller {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ_OWN,
			READ_ANYONE_ON_OWN_DEPARTMENT,
			READ_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	get bodyParser(): null { return null }

	get validations(): Validation[] {
		return [
			new IDParameterValidation([
				[ "id", UserManager ]
			])
		]
	}

	async handle(request: AuthenticatedIDRequest, response: Response)
	: Promise<OkResponseInfo> {
		const manager = new SignatureManager(request.transaction, request.cache)
		const { id } = request.params

		const signatureDocument = await manager.findWithID(
			+id,
			{},
			{ raw: true }
		) as SignatureDocument

		const signature = signatureDocument.data.attributes.signature as unknown as Buffer
		const type = await sniffMediaType(signature)

		Log.success("controller", "successfully got the signature")

		return new OkResponseInfo(signature, type)
	}
}
