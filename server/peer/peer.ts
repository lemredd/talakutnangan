import type { PeerServer } from "!/types/dependent"
import type { GeneralObject } from "$/types/general"

import Log from "$!/singletons/log"
import Developer from "$!/errors/developer"
import RequestEnvironment from "$!/singletons/request_environment"

type PreviousCallInfo = { functionName: string, arguments: GeneralObject<any> }

export default class Peer extends RequestEnvironment {
	private static rawServer: PeerServer|null = null
	private static previousCallInfos: PreviousCallInfo[] = []

	static initialize(server: PeerServer) {
		this.rawServer = server

		Log.trace("app", "initialized peer server")
	}

	static consumePreviousCalls(): PreviousCallInfo[] {
		return this.runDependingOnEnvironment(
			(): PreviousCallInfo[] => {
				throw new Developer(
					"Peer server should not monitor previous calls.",
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

	private static get server(): PeerServer {
		if (this.rawServer && process.env.WEB_PEER_SERVER !== "false") return this.rawServer

		throw new Developer(
			"Peer server was not initialized.",
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
