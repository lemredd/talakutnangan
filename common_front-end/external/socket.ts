import { io, Socket as BaseSocket } from "socket.io-client"

import { SocketListeners } from "$@/types/dependent"

import Stub from "$/singletons/stub"
import RequestEnvironment from "$/helpers/request_environment"

export default class Socket extends RequestEnvironment {
	private static rawSockets: Map<string, BaseSocket> = new Map()
	private static testSockets: Map<string, SocketListeners> = new Map()

	static initialize(): void {
		Stub.runConditionally(
			() => { this.rawSockets.set("/", io()) },
			() => {
				this.testSockets.set("/", {})
				return [ {} as unknown as void, {
					"arguments": [],
					"functionName": "initialize"
				} ]
			}
		)
	}

	static addEventListeners(namespace: string, listeners: SocketListeners): void {
		Stub.runConditionally(
			() => {
				const namespacedSocket = this.getSocket(namespace)

				for (const eventName of Object.getOwnPropertyNames(listeners)) {
					const listener = listeners[eventName]
					namespacedSocket.on(eventName, listener)
				}
			},
			() => {
				const namespacedSocket = this.getTestSocket(namespace)

				for (const eventName of Object.getOwnPropertyNames(listeners)) {
					const listener = listeners[eventName]
					namespacedSocket[eventName] = listener
				}

				return [ {} as unknown as void, {
					"arguments": [ namespace, listeners ],
					"functionName": "addEventListeners"
				} ]
			}
		)
	}

	static emitMockEvent(namespace: string, eventName: string, ...argumentsToPass: any[]): void {
		Stub.runConditionally(
			() => {
				throw new Error("It is impossible to emit mock events in non-test environments.")
			},
			() => {
				const namespacedSocket = this.getTestSocket(namespace)

				namespacedSocket[eventName](...argumentsToPass)

				return [ {} as unknown as void, null ]
			}
		)
	}

	private static getSocket(namespace: string): BaseSocket {
		if (this.rawSockets.size > 0) {
			const rawSocket = this.rawSockets.get(namespace)

			if (rawSocket) return rawSocket

			const newSocket = io(namespace)
			this.rawSockets.set(namespace, newSocket)

			return newSocket
		}

		throw new Error("Developer forgot to initialize the socket")
	}

	private static getTestSocket(namespace: string): SocketListeners {
		if (this.testSockets.size > 0) {
			const testSocket = this.testSockets.get(namespace)

			if (testSocket) return testSocket

			const newSocket = {}
			this.testSockets.set(namespace, newSocket)

			return newSocket
		}

		throw new Error("Developer forgot to initialize the socket")
	}
}
