import { relative, resolve, join, sep } from "path"
import getRoot from "!/helpers/get_root"
import { Purpose, Method, RouteInformation } from "!/types/independent"

export default function(currentPath: string, routeRoot = resolve(getRoot(), "server/app/routes"))
	: Partial<RouteInformation> {
	const relativePath = relative(routeRoot, currentPath)
	const [ _, rawPurpose, rawPath, method ] = /^(api|dev)?(.*?\w+?)\.(\w+?)\.ts$/.exec(relativePath)
	const purpose = <Purpose>(rawPurpose || "enhancer")
	const dirtyPath = "/" + (purpose === "enhancer" ? rawPath : join(purpose, rawPath))
	const path = dirtyPath.replace(/\\/g, "/")

	return {
		method: <Method><unknown>method,
		path,
		purpose
	}
}
