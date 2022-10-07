import chalk from "chalk"
import RouterManager from "!%/router"

async function main() {
	console.log("Registered custom routes:")

	const routerManager = new RouterManager()
	const allInformation = (await routerManager.allRouteInformation)
	.map(({ purpose, method, path }) => ({
		"method": method.toLocaleUpperCase(),
		path,
		// eslint-disable-next-line no-nested-ternary
		"purpose": purpose === "api"
			? `     ${chalk.white.bgBlue("API")}`
			: purpose === "dev"
				? `     ${chalk.white.bgRed(
					purpose.slice(0, 1).toLocaleUpperCase() + purpose.slice(1))}`
				: chalk.white.bgGreen(purpose.slice(0, 1).toLocaleUpperCase() + purpose.slice(1))
	}))

	for (const { purpose, method, path } of allInformation) {
		console.log(
			`\t${purpose} ${method.padStart(6, " ")} ${path}`
		)
	}
}

main()
