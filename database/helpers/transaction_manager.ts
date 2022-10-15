import { Transaction } from "sequelize"

import type {
	TransactionObject,
	LockedTransactionObject,
	TransactionManagerInterface
} from "$!/types/dependent"

import Log from "$!/singletons/log"
import Database from "%/data_source/database"
import DatabaseError from "$!/errors/database"

/**
 * Manages the transaction to be implementation-agnostic
 */
export default class implements TransactionManagerInterface {
	private rawTransaction: Transaction|null = null

	async initialize() {
		if (this.rawTransaction === null && this.isPermitted) {
			/*
			 * For informred decision, please read:
			 * https://medium.com/nerd-for-tech/understanding-database-isolation-levels-c4ebcd55c6b9
			 */
			this.rawTransaction = await Database.dataSource.transaction({
				"isolationLevel": Transaction.ISOLATION_LEVELS.READ_COMMITTED
			})

			Log.success("transaction", "initialized database transaction")
		}
	}

	get transactionObject(): TransactionObject {
		if (this.hasDestroyed || !this.isPermitted) {
			return {}
		}

		return {
			"transaction": this.transaction
		}
	}

	get lockedTransactionObject(): LockedTransactionObject {
		if (this.hasDestroyed || !this.isPermitted) {
			return {}
		}

		return {
			"lock": true,
			...this.transactionObject
		}
	}

	async destroySuccessfully() {
		if (this.mayDestroy) {
			await this.transaction.commit()
			this.rawTransaction = null

			Log.success("transaction", "committed the database changes")
		}
	}

	async destroyIneffectually() {
		if (this.mayDestroy) {
			await this.transaction.rollback()
			this.rawTransaction = null

			Log.success("transaction", "rolled back the database changes")
		}
	}

	get hasDestroyed(): boolean {
		return this.rawTransaction === null
	}

	private get transaction(): Transaction {
		if (this.hasDestroyed) {
			throw new DatabaseError("Transaction is not initiated.")
		}

		return this.rawTransaction as Transaction
	}

	protected get mayDestroy(): boolean {
		return !this.hasDestroyed && this.isPermitted
	}

	private get mustReturnEmptyObject(): boolean {
		return this.hasDestroyed || !this.isPermitted
	}

	private get isPermitted(): boolean {
		return (process.env.DATABASE_TRANSACTION || "true") === "true"
	}
}
