import type { Request, Response, NextFunction } from "!/types/dependent"

import Middleware from "!/bases/middleware"

export default class extends Middleware {
	private middlewares: Middleware[]

	constructor(middlewares: Middleware[]) {
		super()
		this.middlewares = middlewares
	}

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		let chain = new Promise<void>((resolve, reject) => {
			const middleware = this.middlewares.pop() as Middleware

			middleware.intermediate(request, response, (error?: any) => {
				if (error) reject(error)
				resolve()
			})
		})


		for (const middleware of this.middlewares) {
			chain = chain.then(() => new Promise<void>((resolve, reject) => {
				middleware.intermediate(request, response, (error?: any) => {
					if (error) reject(error)
					resolve()
				})
			}))
		}

		try {
			await chain
			next()
		} catch (error) {
			next(error)
		}
	}
}
