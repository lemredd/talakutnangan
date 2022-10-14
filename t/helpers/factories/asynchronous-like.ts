import { faker } from "@faker-js/faker"

import type { Model } from "%/types/dependent"
import type { GeneralObject } from "$/types/general"
import type {
	ResourceIdentifier,
	Attributes,
	DeserializedResource,
	DeserializedResourceDocument,
	DeserializedResourceListDocument,
	Resource,
	ResourceDocument,
	ResourceListDocument
} from "$/types/documents/base"

import digest from "$!/helpers/digest"

import BaseFactory from "~/factories/base"

export default abstract class AsynchronouseLikeFactory<
	T extends Model,
	U extends ResourceIdentifier<"read">,
	V extends Attributes<"serialized">,
	W extends Attributes<"deserialized">,
	X extends Resource<"read", U, V>,
	Y extends DeserializedResource<U, W>,
	Z extends ResourceDocument<"read", U, V, X>,
	A extends ResourceListDocument<"read", U, V, X>,
	B extends DeserializedResourceDocument<U, W, Y>,
	C extends DeserializedResourceListDocument<U, W, Y>,
	D
> extends BaseFactory<T, U, V, W, X, Y, Z, A, B, C, D> {
	protected tokenGenerator: () => Promise<string> = async() => {
		const rawWord = Buffer.from(faker.word.adjective())
		return await digest(rawWord)
	}

	token(generator: () => Promise<string>)
	: AsynchronouseLikeFactory<T, U, V, W, X, Y, Z, A, B, C, D> {
		this.tokenGenerator = generator
		return this
	}

	protected originGenerator: () => string = () => `/${faker.word.noun()}`

	origin(generator: () => string)
	: AsynchronouseLikeFactory<T, U, V, W, X, Y, Z, A, B, C, D> {
		this.originGenerator = generator
		return this
	}

	protected finishedStepCountGenerator: () => number = () => 0

	finishedStepCount(generator: () => number)
	: AsynchronouseLikeFactory<T, U, V, W, X, Y, Z, A, B, C, D> {
		this.finishedStepCountGenerator = generator
		return this
	}

	protected totalStepCountGenerator: () => number = () => 10

	totalStepCount(generator: () => number)
	: AsynchronouseLikeFactory<T, U, V, W, X, Y, Z, A, B, C, D> {
		this.totalStepCountGenerator = generator
		return this
	}

	protected hasStoppedGenerator: () => boolean = () => false

	hasStopped(generator: () => boolean)
	: AsynchronouseLikeFactory<T, U, V, W, X, Y, Z, A, B, C, D> {
		this.hasStoppedGenerator = generator
		return this
	}

	protected extraGenerator: () => GeneralObject = () => ({})

	extra(generator: () => GeneralObject)
	: AsynchronouseLikeFactory<T, U, V, W, X, Y, Z, A, B, C, D> {
		this.extraGenerator = generator
		return this
	}
}
