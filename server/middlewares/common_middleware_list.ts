import GuestPageGuard from "!/middlewares/authentication/guest_page_guard"
import AuthenticatedPageGuard from "!/middlewares/authentication/authenticated_page_guard"

export default class CommonMiddlewareList {
	static guestPageGuard: GuestPageGuard
	static basicAuthenticatedPageGuard: AuthenticatedPageGuard

	constructor() {
		CommonMiddlewareList.guestPageGuard = new GuestPageGuard()
		CommonMiddlewareList.basicAuthenticatedPageGuard = new AuthenticatedPageGuard(null)
	}
}
