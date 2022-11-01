import type { MediaConnection, Peer } from "peerjs"

import { PeerEventListeners } from "$@/types/dependent"

import { PEER_SERVER_COMPLETE_PATH } from "$/constants/template_links"

import Stub from "$/singletons/stub"
import RequestEnvironment from "$/singletons/request_environment"

export default class Socket extends RequestEnvironment {
	private static rawPeer: Peer|null = null
	private static id: string|null = null
	private static selfStream: MediaStream

	static initialize(
		connectionListener: (id: string) => void,
		stream: MediaStream,
		answerListener: (otherStream: MediaStream) => void
	): void {
		Stub.runConditionally(
			() => {
				this.rawPeer = new Peer({
					"path": PEER_SERVER_COMPLETE_PATH
				})
				this.selfStream = stream
				this.peer.on("open", id => {
					this.id = id
					connectionListener(id)
				})

				this.peer.on("call", (mediaConnection: MediaConnection) => {
					mediaConnection.answer(this.selfStream)
					answerListener(mediaConnection.remoteStream)
				})
			},
			() => {
				this.testSockets.set("/", {})
				return [ {} as unknown as void, {
					"arguments": [],
					"functionName": "initialize"
				} ]
			}
		)
	}

	static call(targetPeerID: string) {
		this.peer.call(targetPeerID, this.selfStream)
	}

	static addEventListeners(listeners: PeerEventListeners): void {
		Stub.runConditionally(
			() => {
				this.listeners.push(listeners)
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

	public static get peerID(): string {
		if (this.id === null) throw new Error("Peer Server is not ready yet.")
		return this.id
	}

	private static get peer(): Peer {
		if (this.rawPeer === null) throw new Error("Developer forgot to initialize the socket")
		return this.rawPeer
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
