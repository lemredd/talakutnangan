import Middleware from "!/bases/middleware"
import TransactionCommitter from "!/middlewares/miscellaneous/transaction_committer"

export default async function(): Promise<Middleware[]> {
	return [
		new TransactionCommitter()
	]
}
