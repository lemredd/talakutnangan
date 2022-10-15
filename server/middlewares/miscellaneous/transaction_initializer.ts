import type { Request } from "!/types/dependent"

import TransactionManager from "%/helpers/transaction_manager"

import RequestFilter from "!/bases/request_filter"

export default class TransanctionInitializer extends RequestFilter {
	async filterRequest(request: Request): Promise<void> {
		request.transaction = new TransactionManager()

		await request.transaction.initialize()
	}
}
