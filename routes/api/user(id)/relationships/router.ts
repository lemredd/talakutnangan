import Router from "!/bases/router"
import RoleRouter from "!%/api/user(id)/relationships/role/router"
import SignatureRouter from "!%/api/user(id)/relationships/signature/router"
import DepartmentRouter from "!%/api/user(id)/relationships/department/router"
import ProfilePictureRouter from "!%/api/user(id)/relationships/profile_picture/router"

export default class extends Router {
	constructor() {
		super()

		this.useRouters([
			new RoleRouter(),
			new SignatureRouter(),
			new DepartmentRouter(),
			new ProfilePictureRouter()
		])
	}
}
