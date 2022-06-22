import chalk from "chalk"
import RouterManager from "!/app/routes/router"

function main() {
	console.log("Registered custom routes:")

	const routerManager = new RouterManager()
	const allInformation = routerManager.allRouteInformation
		.map(({ purpose, method, path }) => ({
			purpose: purpose === "api"
				? "     " + chalk.white.bgBlue("API")
				: purpose === "dev"
					? "     " + chalk.white.bgRed(
						purpose.slice(0, 1).toLocaleUpperCase() + purpose.slice(1))
					: chalk.white.bgGreen(purpose.slice(0, 1).toLocaleUpperCase() + purpose.slice(1)),
			method: method.toLocaleUpperCase(),
			path
		}))

	for(const { purpose, method, path } of allInformation) {
		console.log(
			`\t${purpose} ${method.padStart(6, " ")} ${path}`
		)
	}
}

main()
