import { SocketListeners } from "$@/types/dependent"
import Stub from "$/helpers/singletons/stub"
import Socket from "./socket"

describe("External: Socket", () => {
	it("can intiialize", () => {
		Socket.initialize()

		const previousCalls = Stub.consumePreviousCalls()

		expect(previousCalls).toHaveProperty("0.functionName", "initialize")
		expect(previousCalls).toHaveProperty("0.arguments", [])
	})

	it("can add event listeners and handle events", () => {
		Socket.initialize()
		const eventData = "Hello world!"
		const mockChat = jest.fn()
		const namespace = "a"
		const listeners: SocketListeners = {
			"chat": mockChat
		}

		Socket.addEventListeners(namespace, listeners)
		Socket.emitMockEvent(namespace, "chat", eventData)

		expect(mockChat).toHaveBeenCalled()
		expect(mockChat.mock.calls).toEqual([ [ eventData ] ])
	})
})
