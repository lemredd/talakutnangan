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
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import Consulter from "%/models/consulter"
import Consultation from "%/models/consultation"
import AttachedRole from "%/models/attached_role"
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
	#consultantInfoGenerator: () => Promise<AttachedRole>
		= async() => {
			const role = await new RoleFactory().insertOne()
			const user = await new UserFactory().insertOne()
			const attachedRole = await AttachedRole.create({
				"roleID": role.id,
				"userID": user.id
			})

			attachedRole.role = role
			attachedRole.user = user

			return attachedRole
		}

	#statusGenerator: () => string = () => faker.helpers.arrayElement([
		"will_start",
		"ongoing",
		"done"
	])

	#consultersGenerator: () => Promise<User[]> = () => new UserFactory().insertMany(1)
	#reasonGenerator: () => string = () => faker.hacker.phrase()
	#actionTakenGenerator: () => string = () => faker.hacker.phrase()
	#scheduledStartDatetimeGenerator: () => Date = () => new Date()
	#endDatetimeGenerator: () => Date|null = () => new Date()

	// TODO date

	get model(): ModelCtor<Consultation> { return Consultation }

	get transformer(): ConsultationTransformer { return new ConsultationTransformer() }

	async generate(): GeneratedData<Consultation> {
		return {
			"attachedRoleID": (await this.#consultantInfoGenerator()).id,
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

	async attachChildren(model: Consultation): Promise<Consultation> {
		const consulters = await this.#consultersGenerator()

		if (model.id) {
			const rawConsulters: { userID: number, consultationID: number }[] = consulters
			.map(consulter => ({
				"userID": consulter.id as number,
				"consultationID": model.id as number
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

	consultantInfo(generator: () => Promise<AttachedRole>): ConsultationFactory {
		this.#consultantInfoGenerator = generator
		return this
	}

	consulters(generator: () => Promise<User[]>): ConsultationFactory {
		this.#consultersGenerator = generator
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
