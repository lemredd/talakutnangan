import type { Request, Response } from "!/types/dependent"
import type { FieldRules, Rules } from "!/types/validation"
import type { AttachedFile } from "$/types/documents/file-like"
import type { ChatMessageDocument } from "$/types/documents/chat_message"

import { MAXIMUM_FILE_SIZE, MINIMUM_FILE_SIZE } from "!/constants/measurement"

import Socket from "!/ws/socket"
import Log from "$!/singletons/log"
import Manager from "%/managers/chat_message"
import CreatedResponseInfo from "!/response_infos/created"
import makeConsultationChatNamespace from "$/namespace_makers/consultation_chat"

import Middleware from "!/bases/middleware"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import object from "!/validators/base/object"
import buffer from "!/validators/base/buffer"
import required from "!/validators/base/required"

import CreateRoute from "!%/api/chat_message/create.post"

export default class extends CreateRoute {
	get filePath(): string { return __filename }

	get bodyParser(): Middleware {
		return CommonMiddlewareList.multipart
	}

	makeBodyRuleGenerator(request: Request): FieldRules {
		const meta: Rules = {
			"constraints": {
				"object": {
					"fileContents": {
						"constraints": {
							"buffer": {
								"allowedMimeTypes": [ "text/plain", "image/png" ],
								"maximumSize": MAXIMUM_FILE_SIZE,
								"minimumSize": MINIMUM_FILE_SIZE
							}
						},
						"pipes": [ required, buffer ]
					}
				}
			},
			"pipes": [ required, object ]
		}

		const originalRules = super.makeBodyRuleGenerator(request)

		return {
			...originalRules,
			meta
		}
	}

	async handle(request: Request, unusedResponse: Response): Promise<CreatedResponseInfo> {
		const manager = new Manager(request)
		const { data, meta } = request.body as ChatMessageDocument<"create"> & AttachedFile<"raw">
		const { attributes, relationships } = data
		const chatMessageActivityID = Number(relationships.chatMessageActivity.data.id)

		const document = await manager.createWithFile({
			...attributes,
			chatMessageActivityID
		}, meta.fileContents.buffer as Buffer) as ChatMessageDocument<"create">

		Socket.emitToClients(
			makeConsultationChatNamespace(document.data.relationships.consultation.data.id),
			"create",
			document
		)

		Log.success("controller", "successfully created the chat message of the user with file")

		return new CreatedResponseInfo(document)
	}
}
