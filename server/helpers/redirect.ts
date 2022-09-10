import type { Response } from "!/types/dependent"
import RequestEnvironment from "$/singletons/request_environment"

export default function(
	response: Response,
	location: string,
	statusCode = RequestEnvironment.status.MOVED_TEMPORARILY
): void {
	response.writeHead(statusCode, {
		"Location": location
	})
	response.end()
}
