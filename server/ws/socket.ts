import { Server as WebSocketServer } from "socket.io"

import type { GeneralObject } from "$/types/general"

import Log from "$!/singletons/log"
import Developer from "$!/errors/developer"
import RequestEnvironment from "$!/singletons/request_environment"

type PreviousCallInfo = { functionName: string, arguments: GeneralObject<any> }

export default class Socket extends RequestEnvironment {
	private static rawServer: WebSocketServer|null = null
	private static previousCallInfos: PreviousCallInfo[] = []

	static initialize(server: WebSocketServer) {
		this.rawServer = server

		Log.trace("app", "initialized web socket server")
	}

	static emitToClients(namespace: string, eventName: string, ...data: any): void {
		this.runDependingOnEnvironment(
			() => {
				this.server.of(namespace).emit(eventName, ...data)
				Log.trace("socket", `Sent ${eventName} event through "${namespace}" namespace`)
			},
			() => {
				this.previousCallInfos.push({
					"arguments": {
						data,
						eventName,
						namespace
					},
					"functionName": "emitToClients"
				})

				return true
			}
		)
	}

	static consumePreviousCalls(): PreviousCallInfo[] {
		return this.runDependingOnEnvironment(
			(): PreviousCallInfo[] => {
				throw new Developer(
					"Web socket server should not monitor previous calls.",
					"Some services are not working at the moment."
				)
			},
			() => {
				const previousCalls = this.previousCallInfos
				this.previousCallInfos = []
				return previousCalls
			}
		)
	}

	private static get server(): WebSocketServer {
		if (this.rawServer) return this.rawServer

		throw new Developer(
			"Web socket server was not initialized.",
			"Some services are not working at the moment."
		)
	}

	private static runDependingOnEnvironment<T = void>(
		liveMechanism: () => T,
		testMechanism: () => T
	): T {
		if (this.isOnTest) {
			return testMechanism()
		}

		return liveMechanism()
	}
}
