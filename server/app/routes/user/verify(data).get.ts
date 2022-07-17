import { Request } from "!/types/dependent"
import { Serializable } from "$/types/database"

import Log from "$!/singletons/log"
import URLMaker from "$!/singletons/url_maker"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): null { return null }

	async getPageProps(request: Request): Promise<Serializable> {
		const completeURL = `${request.protocol}://${request.hostname}${request.url}`

		const info = await URLMaker.checkTemporaryURL(completeURL)
		Log.errorMessage("server", completeURL)
		return {
			data: "Hello world!"
		}
	}
}
