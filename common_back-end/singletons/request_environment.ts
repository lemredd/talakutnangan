import getRoot from "$!/helpers/get_root"
import BaseRequestEnvironment from "$/helpers/request_environment"

/**
 * Contains the environment information that can be used by the request handlers.
 */
export default class RequestEnvironment extends BaseRequestEnvironment {
	static get root(): string { return getRoot() }

	get root(): string { return getRoot() }
}
