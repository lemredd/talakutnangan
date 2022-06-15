import { relative, resolve, join } from "path"
import { Purpose, Method, RouteInformation } from "!/types/independent"

import getRoot from "!/helpers/get_root"

export default function(currentPath: string, routeRoot = resolve(getRoot(), "server/app/routes"))
	: Partial<RouteInformation> {
	const relativePath = relative(routeRoot, currentPath)
	const pathExpression = /^(api|dev)?(.*?[\w\(\)]+?)\.(\w+?)\.ts$/
	const [ _, rawPurpose, rawPath, method ] = pathExpression.exec(relativePath)!
	const purpose = <Purpose>(rawPurpose || "enhancer")
	const dirtyPath = "/" + (purpose === "enhancer" ? rawPath : join(purpose, rawPath))
	let path = dirtyPath.replace(/\\/g, "/").replace(/\((\w+)\)/g, "/:$1")

	if (purpose === "enhancer") path = path.replace(/index$/, "")

	return {
		method: <Method><unknown>method,
		path,
		purpose
	}
}
