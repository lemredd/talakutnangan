import { faker } from "@faker-js/faker"

import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	SemesterResourceIdentifier,
	SemesterAttributes,
	DeserializedSemesterResource,
	DeserializedSemesterDocument,
	DeserializedSemesterListDocument,
	SemesterResource,
	SemesterDocument,
	SemesterListDocument
} from "$/types/documents/semester"

import BaseFactory from "~/factories/base"
import Semester from "%/models/semester"
import SemesterTransformer from "%/transformers/semester"
import convertForSentence from "$/string/convert_for_sentence"

export default class SemesterFactory extends BaseFactory<
	Semester,
	SemesterResourceIdentifier<"read">,
	SemesterAttributes<"serialized">,
	SemesterAttributes<"deserialized">,
	SemesterResource,
	DeserializedSemesterResource,
	SemesterDocument,
	SemesterListDocument,
	DeserializedSemesterDocument,
	DeserializedSemesterListDocument
> {
	nameGenerator = () => `${
		convertForSentence(faker.random.alpha(faker.mersenne.rand(10, 5)))
	} ${
		convertForSentence(faker.random.alpha(faker.mersenne.rand(10, 7)))
	}`

	#semesterOrder = "first"
	#startAtGenerator: () => Date = () => new Date()
	#endAtGenerator: () => Date = () => new Date()

	get model(): ModelCtor<Semester> { return Semester }

	get transformer(): SemesterTransformer { return new SemesterTransformer() }

	async generate(): GeneratedData<Semester> {
		return {
			"name": await this.nameGenerator,
			"semesterOrder": await this.#semesterOrder,
			"startAt": this.#startAtGenerator(),
			"endAt": this.#endAtGenerator()
		}
	}

	name(generator: () => string): SemesterFactory {
		this.nameGenerator = generator
		return this
	}

	beFirst(): SemesterFactory {
		this.#semesterOrder = "first"
		return this
	}

	beSecond(): SemesterFactory {
		this.#semesterOrder = "second"
		return this
	}

	beThird(): SemesterFactory {
		this.#semesterOrder = "third"
		return this
	}

	startAt(generator: () => Date): SemesterFactory {
		this.#startAtGenerator = generator
		return this
	}

	endAt(generator: () => Date): SemesterFactory {
		this.#endAtGenerator = generator
		return this
	}
}
