module.exports = function() {
	const configuration = {}
	const databaseType = process.env.DATABASE_TYPE

	switch(databaseType) {
		case "mysql":
		case "pgsql": {
			configuration.dialect = databaseType
			configuration.username = process.env.DATABASE_USER
			configuration.password = process.env.DATABASE_PASS
			configuration.database = process.env.DATABASE_NAME
			configuration.host = process.env.DATABASE_HOST
			configuration.port = process.env.DATABASE_PORT
			break
		}

		case "filed_sqlite": {
			configuration.dialect = "sqlite"
			configuration.storage = process.env.DATABASE_PATH
			break
		}

		case "memoried_sqlite": {
			configuration.dialect = "sqlite"
			configuration.storage = ":memory:"
			break
		}

		default:
			throw new TypeError(`You have used an unknown database type: "${databaseType}"`)
	}

	return configuration
}
