import { relative, resolve, join } from "path"
import { Purpose, Method, RouteInformation } from "$/types/server"

import getRoot from "$!/helpers/get_root"

export default function(currentPath: string, routeRoot = resolve(getRoot(), "routes"))
	: Partial<RouteInformation> {
	const relativePath = relative(routeRoot, currentPath)
	const pathExpression = /^(api|dev)?(.*?[\w\(\)]+?)\.(\w+?)\.ts$/
	const [ _, rawPurpose, rawPath, method ] = pathExpression.exec(relativePath)!
	const purpose = <Purpose>(rawPurpose || "enhancer")
	const dirtyPath = "/" + (purpose === "enhancer" ? rawPath : join(purpose, rawPath))
	let path = dirtyPath.replace(/\\/g, "/").replace(/\((\w+)\)/g, "/:$1")

	switch(purpose) {
		case "enhancer":
			// Trim "index" suffix for enhancer routes
			path = path.replace(/^\/(.*?)\/?index$/, "/$1")
			break
		case "api":
			// Trim "list", or "create" suffix for API routes
			path = path.replace(/^\/(.*?)\/?(list|create)$/, "/$1")
			break
	}

	return {
		method: <Method><unknown>method,
		path,
		purpose
	}
}
