import type { renderPage } from "vite-plugin-ssr/dist/cjs/node/renderPage"
import type { Request, Response, NextFunction } from "express"

type RenderPage = typeof renderPage

export default async function(
	renderPage: RenderPage,
	request: Request,
	response: Response,
	next: NextFunction
) {
	const url = request.originalUrl
	const pageContextInit = {
		url,
	}
	const pageContext = await renderPage(pageContextInit)
	const { httpResponse } = pageContext
	if (!httpResponse) return next()
	const { body, statusCode, contentType } = httpResponse
	response.status(statusCode).type(contentType).send(body)
}
