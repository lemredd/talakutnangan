import type { Request, Response, NextFunction } from "!/types/dependent"

import Middleware from "!/bases/middleware"

export default class TransactionCommitter extends Middleware {
	async intermediate(request: Request, _response: Response, next: NextFunction): Promise<void> {
		await request.transaction.destroySuccessfully()

		next()
	}
}
