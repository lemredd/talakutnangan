import { Environment } from "!/types";

export default function(): Environment {
	const environment = process.env.NODE_ENV

	switch(environment) {
		case "production": return Environment.Production
		case "test": return Environment.Test
		case "dev": default: return Environment.Development
	}
}
