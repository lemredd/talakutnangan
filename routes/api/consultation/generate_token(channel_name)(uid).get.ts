import type { Request } from "!/types/dependent"

import { channelName, channelNameDescription } from "$!/constants/regex"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import OkResponse from "!/response_infos/ok"
import Manager from "%/managers/consultation"
import generateToken from "!/helpers/generate_token"
import RouteParameterValidation from "!/validations/route_parameter"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import ChatMessageActivityManager from "%/managers/chat_message_activity"

import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import exists from "!/validators/manager/exists"
import regex from "!/validators/comparison/regex"
import required from "!/validators/base/required"
import length from "!/validators/comparison/length"
import Controller from "!/bases/controller-likes/controller"

export default class extends Controller {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.consultationParticipantsOnlyPolicy
	}

	get bodyParser(): null { return null }

	get validations(): Validation[] {
		return [
			new RouteParameterValidation(() => ({
				"channel_name": {
					"constraints": {
						"length": {
							"maximum": 255,
							"minimum": 3
						},
						"regex": {
							"friendlyDescription": channelNameDescription,
							"match": channelName
						}
					},
					"pipes": [ required, string, length, regex ]
				},
				"uid": {
					"constraints": {
						"integer": {
							"mustCast": true
						},
						"manager": {
							"className": ChatMessageActivityManager,
							"columnName": "id"
						}
					},
					"pipes": [ required, integer, exists ]
				}
			}))
		]
	}

	handle(request: Request): Promise<OkResponse> {
		const {
			"channel_name": specifiedChannelName,
			"uid": userID
		} = request.params

		return Promise.resolve(new OkResponse({
			"meta": {
				"RTCToken": generateToken(specifiedChannelName, Number(userID))
			}
		}))
	}
}
