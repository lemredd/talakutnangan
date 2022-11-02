import type { FileMessage } from "$/types/message"
import type { Response, BaseManagerClass, AuthenticatedIDRequest } from "!/types/dependent"
import type {
	AttachedChatFileDocument,
	DeserializedAttachedChatFileDocument
} from "$/types/documents/attached_chat_file"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import deserialize from "$/object/deserialize"
import BoundController from "!/controllers/bound"
import Manager from "%/managers/attached_chat_file"
import sniffMediaType from "!/helpers/sniff_media_type"
import AttachmentResponseInfo from "!/response_infos/attachment"

import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"
import {
	READ_OWN,
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

export default class extends BoundController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ_OWN,
			READ_ANYONE_ON_OWN_DEPARTMENT,
			READ_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	get manager(): BaseManagerClass { return Manager }

	async handle(request: AuthenticatedIDRequest, unusedResponse: Response)
	: Promise<AttachmentResponseInfo> {
		const manager = new Manager(request)
		const { id } = request.params

		const attachedChatFileDocument = await manager.findWithID(
			Number(id),
			{
				"constraints": {
					"filter": {
						"existence": "*"
					}
				},
				"transformerOptions": {
					"raw": true
				}
			}
		) as AttachedChatFileDocument<"read", "raw">

		const deserializedAttachedChatFile = deserialize(
			attachedChatFileDocument
		) as DeserializedAttachedChatFileDocument<"raw", "chatMessage">
		const attachedChatFile = deserializedAttachedChatFile.data.fileContents
		const chatMessage = deserializedAttachedChatFile.data.chatMessage.data
		const fileMessageData = chatMessage.data as FileMessage["data"]
		const filename = fileMessageData.name
		const type = await sniffMediaType(attachedChatFile)

		Log.success("controller", "successfully got the attached chat file")

		return new AttachmentResponseInfo(attachedChatFile, filename, type)
	}
}
