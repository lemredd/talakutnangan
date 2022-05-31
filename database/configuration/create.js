const { URL } = require("url")

module.exports = function(databaseType = process.env.DATABASE_TYPE) {
	const configuration = {}

	switch(databaseType) {
		case "pgsql": {
			const databaseURL = new URL(process.env.DATABASE_URL)
			configuration.dialect = "postgres"
			configuration.username = databaseURL.username
			configuration.password = databaseURL.password
			configuration.database = databaseURL.pathname
			configuration.host = databaseURL.hostname
			configuration.port = +databaseURL.port
			break
		}

		case "mysql": {
			configuration.dialect = "mysql"
			configuration.username = process.env.DATABASE_USER
			configuration.password = process.env.DATABASE_PASS
			configuration.database = process.env.DATABASE_NAME
			configuration.host = process.env.DATABASE_HOST
			configuration.port = +process.env.DATABASE_PORT
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

		case "unit_test": {
			configuration.dialect = "sqlite"
			configuration.storage = ":memory:"
			configuration.logging = () => {}
			break
		}

		default:
			throw new TypeError(`You have used an unknown database type: "${databaseType}"`)
	}

	return configuration
}
