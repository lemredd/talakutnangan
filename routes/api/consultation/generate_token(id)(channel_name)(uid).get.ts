import type { Request } from "!/types/dependent"

import { channelName, channelNameDescription } from "$!/constants/regex"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import OkResponse from "!/response_infos/ok"
import Manager from "%/managers/consultation"
import generateToken from "!/helpers/generate_token"
import Merger from "!/middlewares/miscellaneous/merger"
import RouteParameterValidation from "!/validations/route_parameter"
import ChatMessageActivityManager from "%/managers/chat_message_activity"

import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import BelongsToCurrentUserPolicy from "!/policies/belongs_to_current_user"

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
		return new Merger([
			CommonMiddlewareList.consultationParticipantsOnlyPolicy,
			new BelongsToCurrentUserPolicy(Manager)
		]) as unknown as Policy
	}

	get bodyParser(): null { return null }

	get validations(): Validation[] {
		return [
			new RouteParameterValidation(() => ({
				"channel_name": {
					"constraints": {
						"length": {
							"maximum": 64,
							"minimum": 3
						},
						"regex": {
							"friendlyDescription": channelNameDescription,
							"match": channelName
						}
					},
					"pipes": [ required, string, length, regex ]
				},
				"id": {
					"constraints": {
						"manager": {
							"className": Manager,
							"columnName": "id"
						}
					},
					"pipes": [ required, integer, exists ]
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
