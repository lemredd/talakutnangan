import type { PageRequest } from "!/types/hybrid"
import type { DocumentProps } from "$/types/server"
import type { Serializable } from "$/types/general"
import type { Request, Response, NextFunction } from "!/types/dependent"

import Log from "$!/singletons/log"
import Validation from "!/bases/validation"
import ControllerLike from "!/bases/controller-like"

/**
 * Base class for helpers to page route.
 *
 * This is intended to set up the passing of data to client.
 */
export default abstract class extends ControllerLike {
	getPageProps(unusedRequest: Request): Promise<Serializable>|Serializable {
		return {}
	}

	getDocumentProps(request: Request): Promise<DocumentProps>|DocumentProps {
		// TODO: Remove in v0.15
		Log.errorMessage("controller", `Document props getter must be implemented in ${request.url}.`)

		return {
			"title": "Vite SSR app",
			"description": "App using Vite + vite-plugin-ssr"
		}
	}

	get endHandler(): null { return null }

	get bodyParser(): null { return null }

	get validations(): Validation[] { return [] }

	async intermediate(
		request: PageRequest,
		_response: Response,
		next: NextFunction
	): Promise<void> {
		try {
			request.pageProps = {
				"userProfile": request.isAuthenticated() ? request.user as Serializable : null,
				...await this.getPageProps(request)
			}

			request.documentProps = await this.getDocumentProps(request)

			next()
		} catch (error) {
			next(error)
		}
	}
}
