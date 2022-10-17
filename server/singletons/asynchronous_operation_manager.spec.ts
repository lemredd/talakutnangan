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
		const body = Buffer.alloc(0)
		const params = { "id": 1 }
		requester.customizeRequest({
			body,
			params,
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
		const params = { "id": 1 }
		const uniqueCombination = Buffer.concat([ body, Buffer.from(JSON.stringify(params)) ])
		const finishedStepCount = 2
		const totalStepCount = 4
		await new Factory()
		.token(() => digest(uniqueCombination))
		.user(() => Promise.resolve(user))
		.finishedStepCount(() => finishedStepCount)
		.totalStepCount(() => totalStepCount)
		.insertOne()

		requester.customizeRequest({
			body,
			params,
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

	it("can initialize properly with new parameter", async() => {
		const singleton = new Singleton()
		const userFactory = new UserFactory()
		const user = await userFactory.insertOne()
		const body = Buffer.alloc(0)
		const oldParams = { "id": 1 }
		const newParams = { "id": 2 }
		const uniqueCombination = Buffer.concat([ body, Buffer.from(JSON.stringify(oldParams)) ])
		const finishedStepCount = 2
		const totalStepCount = 4
		await new Factory()
		.token(() => digest(uniqueCombination))
		.user(() => Promise.resolve(user))
		.finishedStepCount(() => finishedStepCount)
		.totalStepCount(() => totalStepCount)
		.insertOne()

		requester.customizeRequest({
			body,
			"params": newParams,
			"user": await userFactory.serialize(user)
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

	it("can regenerate document", async() => {
		const singleton = new Singleton()
		const userFactory = new UserFactory()
		const user = await userFactory.insertOne()
		const body = Buffer.alloc(0)
		const params = { "id": 1 }
		const uniqueCombination = Buffer.concat([ body, Buffer.from(JSON.stringify(params)) ])
		const finishedStepCount = 2
		const totalStepCount = 4
		await new Factory()
		.token(() => digest(uniqueCombination))
		.user(() => Promise.resolve(user))
		.finishedStepCount(() => finishedStepCount)
		.totalStepCount(() => totalStepCount)
		.insertOne()
		requester.customizeRequest({
			body,
			params,
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

	it("can increment progress only", async() => {
		const singleton = new Singleton()
		const userFactory = new UserFactory()
		const user = await userFactory.insertOne()
		const body = Buffer.alloc(0)
		const params = { "id": 1 }
		const uniqueCombination = Buffer.concat([ body, Buffer.from(JSON.stringify(params)) ])
		const finishedStepCount = 2
		const totalStepCount = 5
		const message = "hello"
		await new Factory()
		.token(() => digest(uniqueCombination))
		.user(() => Promise.resolve(user))
		.finishedStepCount(() => finishedStepCount)
		.totalStepCount(() => totalStepCount)
		.extra(() => ({ message }))
		.insertOne()
		requester.customizeRequest({
			body,
			params,
			"user": await userFactory.serialize(user)
		})
		await requester.runAsynchronousOperationInitializer(
			singleton.initializeWithRequest.bind(singleton),
			AsynchronousFileManager,
			totalStepCount
		)

		await singleton.incrementProgress()
		const document = await singleton.regenerateDocument()
		const deserializedDocument = deserialize(document) as AsynchronousFileDocument
		await singleton.destroySuccessfully()

		expect(deserializedDocument).toHaveProperty("data.finishedStepCount", finishedStepCount + 1)
		expect(deserializedDocument).toHaveProperty("data.totalStepCount", totalStepCount)
		expect(deserializedDocument).toHaveProperty("data.extra", { message })
	})

	it("can increment progress with other updates", async() => {
		const singleton = new Singleton()
		const userFactory = new UserFactory()
		const user = await userFactory.insertOne()
		const body = Buffer.alloc(0)
		const params = { "id": 1 }
		const uniqueCombination = Buffer.concat([ body, Buffer.from(JSON.stringify(params)) ])
		const finishedStepCount = 1
		const totalStepCount = 3
		await new Factory()
		.token(() => digest(uniqueCombination))
		.user(() => Promise.resolve(user))
		.finishedStepCount(() => finishedStepCount)
		.totalStepCount(() => totalStepCount)
		.extra(() => ({ "message": "hello" }))
		.insertOne()
		requester.customizeRequest({
			body,
			params,
			"user": await userFactory.serialize(user)
		})
		await requester.runAsynchronousOperationInitializer(
			singleton.initializeWithRequest.bind(singleton),
			AsynchronousFileManager,
			totalStepCount
		)

		const newMessage = "world"
		await singleton.incrementProgress({ "extra": { "message": newMessage } })
		const document = await singleton.regenerateDocument()
		const deserializedDocument = deserialize(document) as AsynchronousFileDocument
		await singleton.destroySuccessfully()

		expect(deserializedDocument).toHaveProperty("data.finishedStepCount", finishedStepCount + 1)
		expect(deserializedDocument).toHaveProperty("data.totalStepCount", totalStepCount)
		expect(deserializedDocument).toHaveProperty("data.hasStopped", false)
		expect(deserializedDocument).toHaveProperty("data.extra", { "message": newMessage })
	})

	it("can stop progress with other updates", async() => {
		const singleton = new Singleton()
		const userFactory = new UserFactory()
		const user = await userFactory.insertOne()
		const body = Buffer.alloc(0)
		const params = { "id": 1 }
		const uniqueCombination = Buffer.concat([ body, Buffer.from(JSON.stringify(params)) ])
		const finishedStepCount = 1
		const totalStepCount = 3
		await new Factory()
		.token(() => digest(uniqueCombination))
		.user(() => Promise.resolve(user))
		.finishedStepCount(() => finishedStepCount)
		.totalStepCount(() => totalStepCount)
		.extra(() => ({ "message": "foo" }))
		.insertOne()
		requester.customizeRequest({
			body,
			params,
			"user": await userFactory.serialize(user)
		})
		await requester.runAsynchronousOperationInitializer(
			singleton.initializeWithRequest.bind(singleton),
			AsynchronousFileManager,
			totalStepCount
		)

		const newMessage = "bar"
		await singleton.stopProgress({ "extra": { "message": newMessage } })
		const document = await singleton.regenerateDocument()
		const deserializedDocument = deserialize(document) as AsynchronousFileDocument
		await singleton.destroySuccessfully()

		expect(deserializedDocument).toHaveProperty("data.finishedStepCount", finishedStepCount)
		expect(deserializedDocument).toHaveProperty("data.totalStepCount", totalStepCount)
		expect(deserializedDocument).toHaveProperty("data.hasStopped", true)
		expect(deserializedDocument).toHaveProperty("data.extra", { "message": newMessage })
	})

	it("can finish progress even if other steps will be skipped", async() => {
		const singleton = new Singleton()
		const userFactory = new UserFactory()
		const user = await userFactory.insertOne()
		const body = Buffer.alloc(0)
		const params = { "id": 1 }
		const uniqueCombination = Buffer.concat([ body, Buffer.from(JSON.stringify(params)) ])
		const finishedStepCount = 2
		const totalStepCount = 5
		const message = "hello"
		await new Factory()
		.token(() => digest(uniqueCombination))
		.user(() => Promise.resolve(user))
		.finishedStepCount(() => finishedStepCount)
		.totalStepCount(() => totalStepCount)
		.extra(() => ({ message }))
		.insertOne()
		requester.customizeRequest({
			body,
			params,
			"user": await userFactory.serialize(user)
		})
		await requester.runAsynchronousOperationInitializer(
			singleton.initializeWithRequest.bind(singleton),
			AsynchronousFileManager,
			totalStepCount
		)

		await singleton.finish()
		const document = await singleton.regenerateDocument()
		const deserializedDocument = deserialize(document) as AsynchronousFileDocument
		await singleton.destroySuccessfully()

		expect(deserializedDocument).toHaveProperty("data.finishedStepCount", totalStepCount)
		expect(deserializedDocument).toHaveProperty("data.totalStepCount", totalStepCount)
		expect(deserializedDocument).toHaveProperty("data.hasStopped", true)
		expect(deserializedDocument).toHaveProperty("data.extra", { message })
	})
})
