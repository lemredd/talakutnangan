import type { Express as ExpressApp } from "express"

import type { RequestHandler } from "!/types/dependent"
import TransactionCommitter from "!/middlewares/miscellaneous/transaction_committer"

export default async function(app: ExpressApp) {
	const postJobs = [
		new TransactionCommitter()
	]

	postJobs.forEach(middleware => {
		app.use(middleware.intermediate.bind(middleware) as unknown as RequestHandler)
	})
}
