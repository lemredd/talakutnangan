import GuestPageGuard from "!/middlewares/authentication/guest_page_guard"
import AuthenticatedPageGuard from "!/middlewares/authentication/authenticated_page_guard"

import JSONBodyParser from "!/middlewares/body_parser/json"

export default class CommonMiddlewareList {
	static guestPageGuard: GuestPageGuard
	static basicAuthenticatedPageGuard: AuthenticatedPageGuard
	static JSONBody: JSONBodyParser

	constructor() {
		CommonMiddlewareList.guestPageGuard = new GuestPageGuard()
		CommonMiddlewareList.basicAuthenticatedPageGuard = new AuthenticatedPageGuard(null)
		CommonMiddlewareList.JSONBody = new JSONBodyParser()
	}
}
