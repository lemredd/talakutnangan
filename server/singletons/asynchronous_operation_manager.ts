import type { Serializable } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { AsynchronousLikeAttributes } from "$/types/documents/asynchronous-like"
import type { TransactionManagerInterface, SharedManagerState } from "$!/types/dependent"

import Log from "$!/singletons/log"
import digest from "$!/helpers/digest"
import BaseManager from "%/managers/base"
import deserialize from "$/object/deserialize"
import DeveloperError from "$!/errors/developer"
import TransactionManager from "%/helpers/transaction_manager"

/**
 * Manages the transaction for asynchronous requests to be implementation-agnostic.
 */
export default class extends TransactionManager implements TransactionManagerInterface {
	private rawManager: BaseManager<any, any, any, any, any, any>|null = null
	private rawFinishedStepCount = 0
	private rawTotalStepCount = 0
	private rawID = 0
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
		this.rawManager = new Manager({
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

			const castResource = possibleResource as Serializable
			const attributes = castResource.attributes as Serializable

			this.rawFinishedStepCount = attributes.finishedStepCount as number
		}

		this.rawTotalStepCount = totalStepCount as number

		const castResource = possibleResource as Serializable

		this.rawID = Number(castResource.id)
		await this.destroySuccessfully()
		await this.initialize()
	}

	get isNew(): boolean { return !this.hasFound }

	get finishedStepCount(): number { return this.rawFinishedStepCount }

	get totalStepCount(): number { return this.rawTotalStepCount }

	async regenerateDocument(): Promise<Serializable> {
		return await this.manager.findWithID(this.id)
	}

	async incrementProgress(attributes: Partial<AsynchronousLikeAttributes> = {}): Promise<void> {
		this.rawFinishedStepCount += 1
		await this.manager.update(this.id, {
			...attributes,
			"finishedStepCount": this.finishedStepCount
		})
	}

	protected get manager(): BaseManager<any, any, any, any, any, any> {
		if (this.rawManager === null) {
			const developmentPrerequisite = "Asynchronous operation manager should be initialized"
			throw new DeveloperError(
				`${developmentPrerequisite} before doing something with model manager.`,
				"Developer have executed instructions out of order."
			)
		}

		return this.rawManager
	}

	protected get id(): number {
		if (this.rawID === 0) {
			const developmentPrerequisite = "Asynchronous operation manager should be initialized"
			throw new DeveloperError(
				`${developmentPrerequisite} before doing something with model manager.`,
				"Developer have executed instructions out of order."
			)
		}

		return this.rawID
	}
}
