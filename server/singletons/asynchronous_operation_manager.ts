import type { Request } from "!/types/dependent"
import type { Serializable } from "$/types/general"
import type { TransactionManagerInterface, SharedManagerState } from "$!/types/dependent"

import Log from "$!/singletons/log"
import digest from "$!/helpers/digest"
import BaseManager from "%/managers/base"
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
		request: Request,
		Manager: new(state: SharedManagerState) => BaseManager<any, any, any, any, any, any>,
		totalStepCount: number
	): Promise<void> {
		await super.initialize()
		this.manager = new Manager({
			"cache": request.cache,
			"transaction": this
		})

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
				totalStepCount
			})

			possibleResource = createdDocument.data
		}

		const castResource = possibleResource as Serializable

		this.id = Number(castResource.id)
	}

	get isNew(): boolean { return !this.hasFound }
}
