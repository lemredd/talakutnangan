import type { Serializable } from "$/types/general"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { AsynchronousOperationInterface } from "$!/types/dependent"
import type { AuthenticatedRequest, BaseManagerClass } from "!/types/dependent"
import type { AsynchronousLikeAttributes } from "$/types/documents/asynchronous-like"

import Log from "$!/singletons/log"
import digest from "$!/helpers/digest"
import BaseManager from "%/managers/base"
import deserialize from "$/object/deserialize"
import DeveloperError from "$!/errors/developer"
import TransactionManager from "%/helpers/transaction_manager"

/**
 * Manages the transaction for asynchronous requests to be implementation-agnostic.
 */
export default class extends TransactionManager implements AsynchronousOperationInterface {
	private rawManager: BaseManager<any, any, any, any, any, any>|null = null
	private hasFound = false
	private rawAttributes: Partial<AsynchronousLikeAttributes & { id: number }> = {}

	/**
	 * Expects body of request to be raw.
	 */
	async initializeWithRequest(
		request: AuthenticatedRequest,
		Manager: BaseManagerClass,
		totalStepCount: number
	): Promise<Serializable> {
		await this.initialize()
		this.rawManager = new Manager({
			"cache": request.cache,
			"transaction": this
		})

		const user = deserialize(request.user) as DeserializedUserProfile

		const uniqueCombination = Buffer.concat([
			request.body,
			Buffer.from(JSON.stringify(request.params))
		])
		const hashedBody = await digest(uniqueCombination)
		Log.trace("asynchronous", `digested body and parameters in ${request.url}`)

		let possibleDocument = await this.manager.findOneOnColumn("token", hashedBody, {
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

			possibleDocument = createdDocument
			possibleResource = createdDocument.data
		} else {
			this.hasFound = true
		}

		const castResource = possibleResource as Serializable
		this.rawAttributes = {
			...castResource.attributes as Serializable,
			"id": Number(castResource.id)
		}

		await this.destroySuccessfully()
		await this.initialize()
		Log.trace("asynchronous", "initialize asynchronous operation")

		return possibleDocument
	}

	get isNew(): boolean { return !this.hasFound }

	get finishedStepCount(): number { return this.rawAttributes.finishedStepCount ?? 0 }

	get totalStepCount(): number { return this.rawAttributes.totalStepCount ?? 0 }

	async regenerateDocument(): Promise<Serializable> {
		const document = await this.manager.findWithID(this.id)
		const castData = document.data as Serializable

		this.rawAttributes = { ...castData.attributes as Serializable }

		return document
	}

	async incrementProgress(attributes: Partial<AsynchronousLikeAttributes> = {}): Promise<void> {
		this.rawAttributes = {
			...this.rawAttributes,
			...attributes,
			"finishedStepCount": this.finishedStepCount + 1
		}
		await this.manager.update(this.id, {
			...attributes,
			"finishedStepCount": this.finishedStepCount
		})
		Log.trace("asynchronous", "increment asynchronous operation")
		await this.destroySuccessfully()
		await this.initialize()
	}

	async finish(attributes: Partial<AsynchronousLikeAttributes> = {}): Promise<void> {
		this.rawAttributes = {
			...this.rawAttributes,
			...attributes,
			"finishedStepCount": this.totalStepCount
		}
		await this.manager.update(this.id, {
			...attributes,
			"finishedStepCount": this.finishedStepCount,
			"hasStopped": true
		})
		Log.trace("asynchronous", "finish asynchronous operation")
		await this.destroySuccessfully()
		await this.initialize()
	}

	async destroyConditionally() {
		if (this.mayDestroy) {
			if (this.isCompletelyFinished) {
				await this.destroySuccessfully()
			} else {
				const reason = "Asynchronous operation did not finished properly"
				Log.errorMessage("asynchronous", `${reason} in "${this.origin}"`)
				await this.destroyIneffectually()
			}
		}
	}

	private get manager(): BaseManager<any, any, any, any, any, any> {
		if (this.rawManager === null) {
			const developmentPrerequisite = "Asynchronous operation manager should be initialized"
			throw new DeveloperError(
				`${developmentPrerequisite} before doing something with model manager.`,
				"Developer have executed instructions out of order."
			)
		}

		return this.rawManager
	}

	private get id(): number {
		if (this.rawAttributes.id) {
			return this.rawAttributes.id
		}

		const developmentPrerequisite = "Asynchronous operation manager should be initialized"
		throw new DeveloperError(
			`${developmentPrerequisite} before doing something with model manager.`,
			"Developer have executed instructions out of order."
		)
	}

	private get hasStopped(): boolean {
		if (this.rawAttributes.hasStopped) {
			return this.rawAttributes.hasStopped
		}

		const developmentPrerequisite = "Asynchronous operation manager should be initialized"
		throw new DeveloperError(
			`${developmentPrerequisite} before doing something with model manager.`,
			"Developer have executed instructions out of order."
		)
	}

	private get origin(): string {
		if (this.rawAttributes.origin) {
			return this.rawAttributes.origin
		}

		const developmentPrerequisite = "Asynchronous operation manager should be initialized"
		throw new DeveloperError(
			`${developmentPrerequisite} before doing something with model manager.`,
			"Developer have executed instructions out of order."
		)
	}

	private get isCompletelyFinished(): boolean {
		return this.hasStopped && this.finishedStepCount === this.totalStepCount
	}
}
