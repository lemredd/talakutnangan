import Fetcher from "$@/communicators/fetcher"

export default class extends Fetcher {
	static initialize(basePath: string) {
		super.initialize(basePath, "role")
	}
}
