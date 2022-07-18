import { Request } from "!/types/dependent"
import { Serializable } from "$/types/database"

import Log from "$!/singletons/log"
import UserManager from "%/managers/user"
import URLMaker from "$!/singletons/url_maker"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): null { return null }

	async getPageProps(request: Request): Promise<Serializable> {
		const completeURL = `${request.protocol}://${request.hostname}${request.url}`

		const info = await URLMaker.checkTemporaryURL(completeURL)

		if (!info.hasExpired) {
			const manager = new UserManager()
			const userID = info.data.id as number

			await manager.verify(userID)

			Log.success("controller", "email verified")
		}

		return info
	}
}
