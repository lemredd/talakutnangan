import { Transaction } from "sequelize"

import Database from "%/data_source/database"

/**
 * Manages the transaction to be implementation-agnostic
 */
export default class {
	private currentTransaction: Transaction|null = null

	async initialize() {
		if (this.currentTransaction === null) {
			// For informred decision, please read:
			// https://medium.com/nerd-for-tech/understanding-database-isolation-levels-c4ebcd55c6b9
			this.currentTransaction = await Database.dataSource.currentTransaction({
				isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
			})
		}
	}

	get transaction(): Transaction { return this.currentTransaction }

	async destroySuccessfully() {
		if (this.currentTransaction !== null) {
			await this.currentTransaction.commit()
			this.currentTransaction = null
		}
	}

	async destroyIneffectually() {
		if (this.currentTransaction !== null) {
			await this.currentTransaction.rollback()
			this.currentTransaction = null
		}
	}
}
