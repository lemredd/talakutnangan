import { Request, Response, NextFunction } from "express"
import type { WithUser }  from "!/types"

export default function() {
	return async function(request: Request & WithUser, response: Response, next: NextFunction) {
		request.logout()

		// TODO: regenerate XSRF-Token or session

		response.redirect("/")
	}
}
