import RouterManager from "!/app/routes/router_manager"

function main() {
	console.log("Registered custom routes:")

	const routerManager = new RouterManager()
	const allInformation = routerManager.allRouteInformation
		.map(({ purpose, method, path }) => ({
			purpose: purpose === "api"
				? "API"
				: purpose.slice(0, 1).toLocaleUpperCase() + purpose.slice(1),
			method: method.toLocaleUpperCase(),
			path
		}))

	console.table(allInformation)
}

main()
