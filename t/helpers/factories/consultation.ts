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
import Role from "%/models/role"
import BaseFactory from "~/factories/base"
import UserFactory from "~/factories/user"
import Consulter from "%/models/consulter"
import Consultation from "%/models/consultation"
import AttachedRole from "%/models/attached_role"
import AttachedRoleFactory from "~/factories/attached_role"
import ConsultationTransformer from "%/transformers/consultation"

export default class ConsultationFactory extends BaseFactory<
	Consultation,
	ConsultationResourceIdentifier<"read">,
	ConsultationAttributes<"serialized">,
	ConsultationAttributes<"deserialized">,
	ConsultationResource,
	DeserializedConsultationResource,
	ConsultationDocument,
	ConsultationListDocument,
	DeserializedConsultationDocument,
	DeserializedConsultationListDocument
> {
	#consultantInfoGenerator: () => Promise<AttachedRole>
		= async() => {
			const attachedRole = await new AttachedRoleFactory()
			.user(() => new UserFactory().beReachableEmployee().insertOne())
			.insertOne()

			return attachedRole
		}

	#consultersGenerator: () => Promise<User[]> = () => new UserFactory().insertMany(1)
	#reasonGenerator: () => string = () => `${
		faker.hacker.noun()
	}-${
		faker.hacker.noun()
	}-${
		faker.hacker.noun()
	}`

	#actionTakenGenerator: () => string|null = () => null
	#scheduledStartAtGenerator: () => Date = () => new Date()
	#startedAtGenerator: () => Date|null = () => new Date()
	#finishedAtGenerator: () => Date|null = () => new Date()

	get model(): ModelCtor<Consultation> { return Consultation }

	get transformer(): ConsultationTransformer { return new ConsultationTransformer() }

	async generate(): GeneratedData<Consultation> {
		return {
			"actionTaken": this.#actionTakenGenerator(),
			"attachedRoleID": (await this.#consultantInfoGenerator()).id,
			"deletedAt": null,
			"finishedAt": this.#finishedAtGenerator(),
			"reason": this.#reasonGenerator(),
			"scheduledStartAt": this.#scheduledStartAtGenerator(),
			"staredAt": this.#startedAtGenerator()
		}
	}

	async attachRelatedModels(model: Consultation): Promise<Consultation> {
		/*
		 * TODO Message
		 * TODO Consultation Requesters
		 * TODO Chat Message Activity
		 */
		const consulters = await this.#consultersGenerator()

		if (model.id) {
			const rawConsulters: { userID: number, consultationID: number }[] = consulters
			.map(consulter => ({
				"consultationID": model.id as number,
				"userID": consulter.id as number
			}))

			await Consulter.bulkCreate(rawConsulters)
		}

		model.consulters = consulters

		const consultantInfo = await AttachedRole.findByPk(model.attachedRoleID, {
			"include": [ User, Role ]
		}) as AttachedRole

		model.consultantInfo = consultantInfo

		return model
	}

	reason(generator: () => string): ConsultationFactory {
		this.#reasonGenerator = generator
		return this
	}

	actionTaken(generator: () => string|null): ConsultationFactory {
		this.#actionTakenGenerator = generator
		return this
	}

	scheduledStartAt(generator: () => Date): ConsultationFactory {
		this.#scheduledStartAtGenerator = generator
		return this
	}

	startedAt(generator: () => Date|null): ConsultationFactory {
		this.#startedAtGenerator = generator
		return this
	}

	finishedAt(generator: () => Date|null): ConsultationFactory {
		this.#finishedAtGenerator = generator
		return this
	}

	consultantInfo(generator: () => Promise<AttachedRole>): ConsultationFactory {
		this.#consultantInfoGenerator = generator
		return this
	}

	consulters(generator: () => Promise<User[]>): ConsultationFactory {
		this.#consultersGenerator = generator
		return this
	}
}
