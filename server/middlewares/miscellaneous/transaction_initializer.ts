import TransactionManager from "%/managers/helpers/transaction_manager"
import type { Request, Response, NextFunction } from "!/types/dependent"

import Middleware from "!/bases/middleware"

export default class TransanctionInitializer extends Middleware {
	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		request.transaction = new TransactionManager()

		await request.transaction.initialize()

		next()
	}
}
