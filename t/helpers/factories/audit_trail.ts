import { faker } from "@faker-js/faker"

import type { GeneralObject } from "$/types/general"
import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	AuditTrailResourceIdentifier,
	AuditTrailAttributes,
	DeserializedAuditTrailResource,
	DeserializedAuditTrailDocument,
	DeserializedAuditTrailListDocument,
AuditTrailResource,
AuditTrailDocument,
AuditTrailListDocument
} from "$/types/documents/audit_trail"

import User from "%/models/user"
import UserFactory from "~/factories/user"
import BaseFactory from "~/factories/base"
import AuditTrail from "%/models/audit_trail"
import AuditTrailTransformer from "%/transformers/audit_trail"

export default class AuditTrailFactory extends BaseFactory<
	AuditTrail,
	AuditTrailResourceIdentifier,
	AuditTrailAttributes,
	AuditTrailResource,
	DeserializedAuditTrailResource,
	AuditTrailDocument,
	AuditTrailListDocument,
	DeserializedAuditTrailDocument,
	DeserializedAuditTrailListDocument
> {
	#user: () => Promise<User|null> = () => new UserFactory().insertOne()
	#actionName: () => string = () => {
		return `${faker.hacker.noun().replace(" ", "_")}.${faker.hacker.verb()}`
	}
	#extra: () => GeneralObject = () => ({})

	get model(): ModelCtor<AuditTrail> { return AuditTrail }

	get transformer(): AuditTrailTransformer { return new AuditTrailTransformer() }

	async generate(): GeneratedData<AuditTrail> {
		return {
			userID: (await this.#user())?.id,
			actionName: this.#actionName(),
			extra: this.#extra()
		}
	}

	actionName(generator: () => string): AuditTrailFactory {
		this.#actionName = generator
		return this
	}

	extra(generator: () => GeneralObject): AuditTrailFactory {
		this.#extra = generator
		return this
	}

	user(generator: () => Promise<User|null>): AuditTrailFactory {
		this.#user = generator
		return this
	}
}
