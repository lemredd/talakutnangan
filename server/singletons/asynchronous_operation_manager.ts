import type { Serializable } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { TransactionManagerInterface, SharedManagerState } from "$!/types/dependent"

import Log from "$!/singletons/log"
import digest from "$!/helpers/digest"
import BaseManager from "%/managers/base"
import deserialize from "$/object/deserialize"
import TransactionManager from "%/helpers/transaction_manager"

/**
 * Manages the transaction for asynchronous requests to be implementation-agnostic.
 */
export default class extends TransactionManager implements TransactionManagerInterface {
	private manager: BaseManager<any, any, any, any, any, any>|null = null
	private id = 0
	private hasFound = false

	/**
	 * Expects body of request to be raw.
	 */
	async initializeWithRequest(
		request: AuthenticatedRequest,
		Manager: new(state: SharedManagerState) => BaseManager<any, any, any, any, any, any>,
		totalStepCount: number
	): Promise<void> {
		await this.initialize()
		this.manager = new Manager({
			"cache": request.cache,
			"transaction": this
		})

		const user = deserialize(request.user) as DeserializedUserProfile

		const hashedBody = await digest(request.body)
		Log.trace("asynchronous", `digested body in ${request.url}`)

		const possibleDocument = await this.manager.findOneOnColumn("token", hashedBody, {
			"constraints": {
				"filter": {
					"existence": "exists"
				}
			}
		})
		let possibleResource = possibleDocument.data

		if (possibleResource === null) {
			this.hasFound = false

			const createdDocument = await this.manager.create({
				"extra": {},
				"finishedStepCount": 0,
				"hasStopped": false,
				"origin": request.url,
				"token": hashedBody,
				totalStepCount,
				"userID": Number(user.data.id)
			})

			possibleResource = createdDocument.data
		} else {
			this.hasFound = true
		}

		const castResource = possibleResource as Serializable

		this.id = Number(castResource.id)
		await this.destroySuccessfully()
		await this.initialize()
	}

	get isNew(): boolean { return !this.hasFound }
}
