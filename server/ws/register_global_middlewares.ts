import { Server as WebSocketServer, Socket } from "socket.io"
import type { Request, Response, NextFunction } from "!/types/dependent"

import RequestFilter from "!/bases/request_filter"
import makeGlobalMiddlewares from "!/helpers/make_global_middlewares"

export default function(io: WebSocketServer): void {
	type UseMiddlewareFunction = WebSocketServer["use"]
	type SocketNextFunction
	= UseMiddlewareFunction extends (unusedSocket: any, next: infer T) => void ? T : never
	const middlewares = makeGlobalMiddlewares().filter(
		middleware => middleware instanceof RequestFilter
	)

	middlewares.forEach(middleware => {
		const bindedMiddleware = middleware.intermediate.bind(middleware)
		const wrappedMiddleware = (
			socket: Socket,
			next: SocketNextFunction
		) => bindedMiddleware(
			socket.request as Request,
			{} as Response,
			next as NextFunction
		) as unknown as void
		io.use(wrappedMiddleware)
	})

	// Necessary to prevent leaks
	const ender = (
		socket: Socket,
		next: SocketNextFunction
	) => {
		const request = socket.request as Request
		const castNext = next as NextFunction
		request.transaction.destroySuccessfully()
		.then(castNext)
		.catch(castNext)
	}
	io.use(ender)
}
