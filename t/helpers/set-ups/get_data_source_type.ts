import { SourceType } from "$/types/database"
import { Environment } from "$/types/server"
import getEnvironment from "$/helpers/get_environment"

export default function(): SourceType {
	if (getEnvironment() === Environment.UnitTest) {
		return "unit_test"
	}

	return process.env.DATABASE_TYPE as SourceType
}
