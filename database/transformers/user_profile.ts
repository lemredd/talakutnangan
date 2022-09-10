import type { Serializable } from "$/types/general"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type {
	AttributesObject,
	TransformerOptions
} from "%/types/dependent"

import cloneDeep from "lodash.clonedeep"

import User from "%/models/user"
import UserTransformer from "%/transformers/user"
import DatabaseError from "$!/errors/database"
import deserialize from "$/helpers/deserialize"
import Serializer from "%/transformers/serializer"
import RequestEnvironment from "$/singletons/request_environment"
import makeDefaultPassword from "$!/helpers/make_default_password"

export default class extends UserTransformer {
	transform(model: User|User[], unusedOptions: TransformerOptions): AttributesObject {
		const safeObject = Serializer.whitelist(model, [
			"id",
			"name",
			"email",
			"kind",
			"prefersDark"
		])

		return safeObject
	}

	finalizeTransform(model: User|User[]|null, transformedData: Serializable): Serializable {
		const postTransformedData = super.finalizeTransform(model, transformedData)
		const addPasswordStatus = (targetModel: User, data: Serializable) => {
			const userProfile = deserialize(cloneDeep(data)) as DeserializedUserProfile
			const defaultPassword = makeDefaultPassword(userProfile)
			const hasDefaultPassword = targetModel.password === defaultPassword

			data.meta = {
				hasDefaultPassword
			}
		}

		// Only add password status for individual resource
		if (model instanceof Array || model === null) {
			transformedData.meta = {
				"hasDefaultPassword": null
			}
		} else {
			try {
				addPasswordStatus(model as User, transformedData)
			} catch (error) {
				const castError = error as Error
				if (!RequestEnvironment.isOnTest && RequestEnvironment.isNotOnProduction) {
					throw new DatabaseError(`Student account (user id: ${
						model.id
					}) has no student detail to base the default password. (Other error: ${
						castError.toString()
					})`)
				}
			}
		}

		return postTransformedData
	}
}
