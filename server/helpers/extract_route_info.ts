import { posix } from "path"
import getRoot from "!/helpers/get_root"
import { Purpose, Method, RouteInformation } from "!/types/independent"

export default function(currentPath: string, routeRoot = `${getRoot()}/server/app/routes`)
	: Partial<RouteInformation> {
	const relativePath = posix.relative(routeRoot, currentPath)
	const [ _, rawPurpose, rawPath, method ] = /^(api|dev)?(.*?\w+?)\.(\w+?)\.ts$/.exec(relativePath)
	const purpose = <Purpose>(rawPurpose || "enhancer")
	const path = "/" + (purpose === "enhancer" ? rawPath : posix.join(purpose, rawPath))

	return {
		method: <Method><unknown>method,
		path,
		purpose
	}
}
