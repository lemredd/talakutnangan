import { Server as WebSocketServer, Socket } from "socket.io"
import type { Request, Response, NextFunction } from "!/types/dependent"

import makeGlobalMiddlewares from "!/helpers/make_global_middlewares"

export default function(io: WebSocketServer): void {
	type UseMiddlewareFunction = WebSocketServer["use"]
	type SocketNextFunction
	= UseMiddlewareFunction extends (unusedSocket: any, next: infer T) => void ? T : never
	const middlewares = makeGlobalMiddlewares()

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
}
