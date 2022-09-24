import { VisibilityListener } from "$@/types/dependent"

import Stub from "$/singletons/stub"
import RequestEnvironment from "$/singletons/request_environment"

export default class DocumentVisibility extends RequestEnvironment {
	private static rawListeners: VisibilityListener[] = []

	static addEventListener(listener: VisibilityListener): void {
		this.rawListeners.push(listener)
		Stub.runConditionally(
			() => {
				document.addEventListener("visibilitychange", () => {
					const newState = document.visibilityState
					this.rawListeners.forEach(rawListener => rawListener(newState))
				})
			},
			() => [ {} as unknown as void, {
				"arguments": [ listener ],
				"functionName": "addEventListener"
			} ]
		)
	}

	static emitMockEvent(visibilityState: Document["visibilityState"]): void {
		Stub.runConditionally(
			() => {
				throw new Error("It is impossible to emit mock events in non-test environments.")
			},
			() => {
				this.rawListeners.forEach(rawListener => rawListener(visibilityState))

				return [ {} as unknown as void, null ]
			}
		)
	}
}
