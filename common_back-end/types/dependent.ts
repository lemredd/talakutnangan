import { Transaction } from "sequelize"

import CacheClient from "$!/helpers/cache_client"

export interface TransactionObject { transaction?: Transaction }

export interface LockedTransactionObject extends TransactionObject { lock?: boolean }

export interface TransactionManagerInterface {
	transactionObject: TransactionObject
	lockedTransactionObject: LockedTransactionObject
}

export interface SharedManagerState {
	cache: CacheClient,
	transaction: TransactionManagerInterface
}
