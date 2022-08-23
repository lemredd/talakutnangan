import type { Request, Response, NextFunction } from "!/types/dependent"

import Middleware from "!/bases/middleware"

export default class extends Middleware {
	private middlewares: Middleware[]

	constructor(middlewares: Middleware[]) {
		super()

		if (this.isNotOnProduction) {
			if (middlewares.length < 2) {
				throw new Error("number of middlewares to merge should be at least 2 or more.")
			}
		}

		this.middlewares = middlewares
	}

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		const [ firstMiddleware, ...remainingMiddlewares ] = this.middlewares
		let chain = new Promise<void>((resolve, reject) => {
			const middleware = firstMiddleware

			middleware.intermediate(request, response, (error?: any) => {
				if (error) reject(error)
				resolve()
			})
		})


		for (const middleware of remainingMiddlewares) {
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
