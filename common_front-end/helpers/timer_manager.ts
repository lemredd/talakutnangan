import type { Timer } from "$@/types/independent"

import Stub from "$/singletons/stub"
import RequestEnvironment from "$/singletons/request_environment"

export default class TimerManager extends RequestEnvironment {
	private static currentTimer:Timer|null = null

	static initialize() {
		Stub.runConditionally(
			() => { },
			() => { }
		)
	}
}
