import { SourceType } from "$/types/database"

import Log from "$!/singletons/log"
import initializeDependent from "!/helpers/initializers/initialize_dependent"
import initializeIndependent from "!/helpers/initializers/initialize_independent"

export default async function(sourceType: SourceType) {
	Log.initialize()

	Log.trace("app", "initialized logger")

	await Promise.all([ initializeIndependent(), initializeDependent(sourceType) ])
}
