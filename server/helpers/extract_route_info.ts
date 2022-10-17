import { relative, resolve, join } from "path"
import { Purpose, Method, RouteInformation } from "$/types/server"

import getRoot from "$!/helpers/get_root"

export default function(currentPath: string, routeRoot = resolve(getRoot(), "routes"))
	: Partial<RouteInformation> {
	const relativePath = relative(routeRoot, currentPath)
	const pathExpression = /^(api|dev|enhancer)?(.*?[\w(\\)]+?)\.(\w+?)\.ts$/u
	const [
		unused,
		rawPurpose,
		rawPath,
		method
	] = pathExpression.exec(relativePath) as RegExpExecArray
	const purpose = <Purpose>(rawPurpose || "enhancer")
	const dirtyPath = `/${purpose === "enhancer" ? rawPath : join(purpose, rawPath)}`
	let path = dirtyPath.replace(/\\/ug, "/").replace(/\((\w+)\)/ug, "/:$1")

	switch (purpose) {
		case "enhancer":
			// Trim "index" or "read" suffix for enhancer routes
			path = path.replace(/^\/(.*?)\/?(index|read)(\/:id)?$/u, "/$1$3").replace(/\/\//ug, "/")
			break
		case "api":
			/*
			 * Trim "list", "create", "read", "update", "archive", "restore", or "destroy" suffix for
			 * API routes ID parameter is the only parameter that can be retained if is a suffix
			 */
			path = path.replace(
				/^\/(.*?)\/?(list|create|read|update|archive|restore|destroy)\b(\/:id)?/u,
				"/$1$3"
			)
			break
		default:
	}

	return {
		"method": <Method><unknown>method,
		path,
		purpose
	}
}
