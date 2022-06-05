import { posix } from "path"
import getRoot from "!/helpers/get_root"
import { Method, RouteInformation } from "!/types/independent"

export default function(currentPath: string, routeRoot = `${getRoot()}/server/app/routes`)
	: Partial<RouteInformation> {
	const relativePath = "/" + posix.relative(routeRoot, currentPath)
	const [ _, path, method ] = /^(.+?\/\w+?)\.(\w+?)\.ts$/.exec(relativePath)

	return {
		method: <Method><unknown>method,
		path
	}
}
