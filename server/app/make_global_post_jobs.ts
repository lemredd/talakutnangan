import Middleware from "!/bases/middleware"
import CacheDestroyer from "!/middlewares/miscellaneous/cache_destroyer"
import TransactionCommitter from "!/middlewares/miscellaneous/transaction_committer"

export default async function(): Promise<Middleware[]> {
	return [
		new TransactionCommitter(),
		new CacheDestroyer()
	]
}
