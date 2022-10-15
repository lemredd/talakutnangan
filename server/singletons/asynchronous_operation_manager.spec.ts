import type { AuthenticatedRequest } from "!/types/dependent"
import type { AsynchronousFileDocument } from "$/types/documents/asynchronous_file"

import "~/setups/database.setup"
import UserFactory from "~/factories/user"
import Factory from "~/factories/asynchronous_file"
import MockRequester from "~/setups/mock_requester"
import AsynchronousFileManager from "%/managers/asynchronous_file"

import digest from "$!/helpers/digest"
import deserialize from "$/object/deserialize"
import Singleton from "./asynchronous_operation_manager"

describe("Server singleton: Asynchronous operation manager", () => {
	const requester = new MockRequester<AuthenticatedRequest>()

	it("can initialize properly with new operation", async() => {
		const singleton = new Singleton()
		const user = await new UserFactory().serializedOne(true)
		const totalStepCount = 3

		requester.customizeRequest({
			"body": Buffer.alloc(0),
			user
		})

		await requester.runAsynchronousOperationInitializer(
			singleton.initializeWithRequest.bind(singleton),
			AsynchronousFileManager,
			totalStepCount
		)
		await singleton.destroySuccessfully()

		expect(singleton.isNew).toBeTruthy()
		expect(singleton.finishedStepCount).toBe(0)
		expect(singleton.totalStepCount).toBe(totalStepCount)
	})

	it("can initialize properly with old operation", async() => {
		const singleton = new Singleton()
		const userFactory = new UserFactory()
		const user = await userFactory.insertOne()
		const body = Buffer.alloc(0)
		const finishedStepCount = 2
		const totalStepCount = 4
		await new Factory()
		.token(() => digest(body))
		.user(() => Promise.resolve(user))
		.finishedStepCount(() => finishedStepCount)
		.totalStepCount(() => totalStepCount)
		.insertOne()

		requester.customizeRequest({
			body,
			"user": await userFactory.serialize(user)
		})

		await requester.runAsynchronousOperationInitializer(
			singleton.initializeWithRequest.bind(singleton),
			AsynchronousFileManager,
			totalStepCount
		)
		await singleton.destroySuccessfully()

		expect(singleton.isNew).toBeFalsy()
		expect(singleton.finishedStepCount).toBe(finishedStepCount)
		expect(singleton.totalStepCount).toBe(totalStepCount)
	})

	it("can regenerate document", async() => {
		const singleton = new Singleton()
		const userFactory = new UserFactory()
		const user = await userFactory.insertOne()
		const body = Buffer.alloc(0)
		const finishedStepCount = 2
		const totalStepCount = 4
		await new Factory()
		.token(() => digest(body))
		.user(() => Promise.resolve(user))
		.finishedStepCount(() => finishedStepCount)
		.totalStepCount(() => totalStepCount)
		.insertOne()
		requester.customizeRequest({
			body,
			"user": await userFactory.serialize(user)
		})
		await requester.runAsynchronousOperationInitializer(
			singleton.initializeWithRequest.bind(singleton),
			AsynchronousFileManager,
			totalStepCount
		)

		const document = await singleton.regenerateDocument()
		const deserializedDocument = deserialize(document) as AsynchronousFileDocument
		await singleton.destroySuccessfully()

		expect(deserializedDocument).toHaveProperty("data.finishedStepCount", finishedStepCount)
		expect(deserializedDocument).toHaveProperty("data.totalStepCount", totalStepCount)
	})
})
