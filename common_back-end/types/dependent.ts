import { Transaction } from "sequelize"
import type { Serializable } from "$/types/general"
import type { AsynchronousLikeAttributes } from "$/types/documents/asynchronous-like"

import CacheClient from "$!/helpers/cache_client"

export interface TransactionObject { transaction?: Transaction }

export interface LockedTransactionObject extends TransactionObject { lock?: boolean }

export interface TransactionManagerInterface {
	transactionObject: TransactionObject
	lockedTransactionObject: LockedTransactionObject
}

export interface AsynchronousOperationInterface extends TransactionManagerInterface {
	regenerateDocument: () => Promise<Serializable>
	incrementProgress: (attributes: Partial<AsynchronousLikeAttributes>) => Promise<void>
	finish: (attributes: Partial<AsynchronousLikeAttributes>) => Promise<void>
}

export interface SharedManagerState<
	T extends TransactionManagerInterface = TransactionManagerInterface
> {
	cache: CacheClient,
	transaction?: T
}

export interface SharedAsynchronousOperationState<
	T extends TransactionManagerInterface = TransactionManagerInterface,
	U extends AsynchronousOperationInterface = AsynchronousOperationInterface
> extends SharedManagerState<T> {
	asynchronousOperation: U
}
