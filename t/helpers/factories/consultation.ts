import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	ConsultationResourceIdentifier,
	ConsultationAttributes,
	DeserializedConsultationResource,
	DeserializedConsultationDocument,
	DeserializedConsultationListDocument,
	ConsultationResource,
	ConsultationDocument,
	ConsultationListDocument
} from "$/types/documents/consultation"

import { faker } from "@faker-js/faker"

import User from "%/models/user"
import AttachedRole from "%/models/role"
import BaseFactory from "~/factories/base"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import Consultation from "%/models/consultation"
import ConsultationTransformer from "%/transformers/consultation"

export default class ConsultationFactory extends BaseFactory<
	Consultation,
	ConsultationResourceIdentifier,
	ConsultationAttributes,
	ConsultationResource,
	DeserializedConsultationResource,
	ConsultationDocument,
	ConsultationListDocument,
	DeserializedConsultationDocument,
	DeserializedConsultationListDocument
> {
	#attachedRole: () => Promise<AttachedRole> = () => new RoleFactory().insertOne()
	#statusGenerator: () => string = () => faker.helpers.arrayElement([
		"will_start",
		"ongoing",
		"done"
	])

	#consulterGenerator: () => Promise<User[]> = () => new UserFactory().insertMany(1)
	#reasonGenerator: () => string = () => faker.hacker.phrase()
	#actionTakenGenerator: () => string = () => faker.hacker.phrase()
	#scheduledStartDatetimeGenerator: () => Date = () => new Date()
	#endDatetimeGenerator: () => Date|null = () => new Date()

	// TODO date

	get model(): ModelCtor<Consultation> { return Consultation }

	get transformer(): ConsultationTransformer { return new ConsultationTransformer() }

	async generate(): GeneratedData<Consultation> {
		return {
			"attachedRoleID": (await this.#attachedRole()).id,
			"reason": this.#reasonGenerator(),
			"status": this.#statusGenerator(),
			"actionTaken": this.#actionTakenGenerator(),
			"scheduledStartDatetime": this.#scheduledStartDatetimeGenerator(),
			"endDatetime": this.#endDatetimeGenerator(),
			/*
			 * TODO Message
			 * TODO Consultation Requesters
			 * TODO Chat Message Activity
			 */
			"deletedAt": null
		}
	}

	status(generator: () => string): ConsultationFactory {
		this.#statusGenerator = generator
		return this
	}

	reason(generator: () => string): ConsultationFactory {
		this.#reasonGenerator = generator
		return this
	}

	actionTaken(generator: () => string): ConsultationFactory {
		this.#actionTakenGenerator = generator
		return this
	}

	scheduledStartDatetime(generator: () => Date): ConsultationFactory {
		this.#scheduledStartDatetimeGenerator = generator
		return this
	}

	endDatetime(generator: () => Date|null): ConsultationFactory {
		this.#endDatetimeGenerator = generator
		return this
	}

	attachedRole(generator: () => Promise<AttachedRole>): ConsultationFactory {
		this.#attachedRole = generator
		return this
	}

	consulter(generator: () => Promise<User[]>): ConsultationFactory {
		this.#consulterGenerator = generator
		return this
	}

	willStart(): ConsultationFactory {
		this.#statusGenerator = () => "will_start"
		return this
	}

	onGoing(): ConsultationFactory {
		this.#statusGenerator = () => "ongoing"
		return this
	}

	done(): ConsultationFactory {
		this.#statusGenerator = () => "done"
		return this
	}
}
