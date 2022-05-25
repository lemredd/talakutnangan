import GuestPageGuard from "./authentication/guest_page_guard"

export default class CommonMiddlewareList {
	static guestPageGuard: GuestPageGuard

	constructor() {
		CommonMiddlewareList.guestPageGuard = new GuestPageGuard()
	}
}
