import Router from "!/bases/router"
import SignatureRouter from "!%/api/user(id)/relationships/signature/router"
import ProfilePictureRouter from "!%/api/user(id)/relationships/profile_picture/router"

export default class extends Router {
	constructor() {
		super()

		this.useRouters([
			new SignatureRouter(),
			new ProfilePictureRouter()
		])
	}
}