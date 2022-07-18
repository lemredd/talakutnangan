import { Transaction } from "sequelize"

import Log from "$!/singletons/log"
import Database from "%/data_source/database"

/**
 * Manages the transaction to be implementation-agnostic
 */
export default class {
	private transaction: Transaction|null = null

	async initialize() {
		if (this.transaction === null) {
			// For informred decision, please read:
			// https://medium.com/nerd-for-tech/understanding-database-isolation-levels-c4ebcd55c6b9
			this.transaction = await Database.dataSource.transaction({
				isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
			})

			Log.success("transaction", "initialized database transaction")
		}
	}

	get transactionObject(): { transaction?: Transaction } {
		if (this.transaction === null) {
			return {}
		} else {
			return {
				transaction: this.transaction
			}
		}
	}

	async destroySuccessfully() {
		if (this.transaction !== null) {
			await this.transaction.commit()
			this.transaction = null

			Log.success("transaction", "committed the database changes")
		}
	}

	async destroyIneffectually() {
		if (this.transaction !== null) {
			await this.transaction.rollback()
			this.transaction = null

			Log.success("transaction", "rolled back the database changes")
		}
	}
}
