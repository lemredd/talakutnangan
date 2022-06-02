const dotenv = require("dotenv")
dotenv.config()

const createConfiguration = require("./configuration/create")
const configuration = createConfiguration()

module.exports = {
	development: configuration,
	unit_test: configuration,
	intg_test: configuration,
	production: configuration
}
