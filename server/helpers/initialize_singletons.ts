import { SourceType } from "$/types/database"

import Log from "$!/singletons/log"
import initializeDependent from "!/helpers/initializers/dependent"
import initializeIndependent from "!/helpers/initializers/independent"

export default async function(sourceType: SourceType) {
	Log.initialize()

	Log.trace("app", "initialized logger")

	await Promise.all([ initializeIndependent(), initializeDependent(sourceType) ])
}
