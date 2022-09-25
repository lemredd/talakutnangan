// @ts-check
const { URL } = require("url")

module.exports = function(databaseType = process.env.DATABASE_TYPE) {
	/**
	 * @type {import("sequelize-typescript").SequelizeOptions & { seederStorage: "sequelize" }}
	 * @const
	 */
	const configuration = {
		"seederStorage": "sequelize"
	}

	switch (databaseType) {
		case "pgsql": {
			// @ts-ignore
			const databaseURL = new URL(process.env.DATABASE_URL)
			configuration.dialect = "postgres"
			configuration.username = databaseURL.username
			configuration.password = databaseURL.password
			configuration.database = databaseURL.pathname.slice(1)
			configuration.host = databaseURL.hostname
			configuration.port = Number(databaseURL.port)

			if (process.env.NODE_ENV === "production") {
				configuration.dialectOptions = {
					"ssl": {
						"rejectUnauthorized": true
					}
				}
			}

			break
		}

		case "mysql": {
			configuration.dialect = "mysql"
			configuration.username = process.env.DATABASE_USER
			configuration.password = process.env.DATABASE_PASS
			configuration.database = process.env.DATABASE_NAME
			configuration.host = process.env.DATABASE_HOST
			// @ts-ignore
			configuration.port = Number(process.env.DATABASE_PORT)
			break
		}

		case "filed_sqlite": {
			configuration.dialect = "sqlite"

			if (process.env.NODE_ENV === "intg_test") {
				configuration.storage = process.env.DATABASE_TEST_PATH
			} else {
				configuration.storage = process.env.DATABASE_PATH
			}

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
