import type { FocusListener } from "$@/types/dependent"

import Stub from "$/singletons/stub"
import RequestEnvironment from "$/singletons/request_environment"

export default class extends RequestEnvironment {
	private static rawListeners: FocusListener[] = []

	static addEventListener(listener: FocusListener): void {
		this.rawListeners.push(listener)
		Stub.runConditionally(
			() => {
				window.addEventListener("blur", () => {
					this.rawListeners.forEach(rawListener => rawListener("blur"))
				})
				window.addEventListener("focus", () => {
					this.rawListeners.forEach(rawListener => rawListener("focus"))
				})
			},
			() => [ {} as unknown as void, {
				"arguments": [ listener ],
				"functionName": "addEventListener"
			} ]
		)
	}

	static emitMockEvent(state: "blur" | "focus"): void {
		Stub.runConditionally(
			() => {
				throw new Error("It is impossible to emit mock events in non-test environments.")
			},
			() => {
				this.rawListeners.forEach(rawListener => rawListener(state))

				return [ {} as unknown as void, null ]
			}
		)
	}
}
