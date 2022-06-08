import { Environment } from "!/types/independent";

export default function(): Environment {
	const environment = process.env.NODE_ENV

	switch(environment) {
		case "production": return Environment.Production
		case "intg_test": return Environment.IntegrationTest
		case "unit_test": return Environment.UnitTest
		case "dev": default: return Environment.Development
	}
}
