import type { Request, Response } from "!/types/dependent"

/**
 * Helper function used as last handler for the routes.
 * @param unusedRequest request as passed to request handlers
 * @param response response that must not yet been ended
 */
export default function(unusedRequest: Request, response: Response): void {
	if (!response.writableEnded) response.end()
}
