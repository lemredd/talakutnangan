import { Transaction } from "sequelize"

export interface TransactionObject { transaction?: Transaction }

export interface LockedTransactionObject extends TransactionObject { lock?: boolean }
