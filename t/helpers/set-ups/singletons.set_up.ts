import getDataSourceType from "~/set-ups/get_data_source_type"
import initializeSingletons from "!/helpers/initialize_singletons"

beforeAll(async () => {
	await initializeSingletons(getDataSourceType())
})
