import getRoot from "$!/helpers/get_root"
import BaseRequestEnvironment from "$/singletons/request_environment"

/**
 * Contains the environment information that can be used by the request handlers.
 */
export default class RequestEnvironment extends BaseRequestEnvironment {
	static get root(): string { return getRoot() }

	static get isInMaintenanceMode(): boolean {
		return !process.env.IS_IN_MAINTENANCE || process.env.IS_IN_MAINTENANCE !== "false"
	}

	get root(): string { return RequestEnvironment.root }

	get isInMaintenanceMode(): boolean { return RequestEnvironment.isInMaintenanceMode }
}
