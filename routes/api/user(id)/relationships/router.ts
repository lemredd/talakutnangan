import Router from "!/bases/router"
import RoleRouter from "!%/api/user(id)/relationships/role/router"
import SignatureRouter from "!%/api/user(id)/relationships/signature/router"
import instantiateSimultaneously from "!/helpers/instantiate_simultaneously"
import DepartmentRouter from "!%/api/user(id)/relationships/department/router"
import ProfilePictureRouter from "!%/api/user(id)/relationships/profile_picture/router"

export default class extends Router {
	constructor() {
		super()

		this.useRoutersAsync(instantiateSimultaneously([
			RoleRouter,
			SignatureRouter,
			DepartmentRouter,
			ProfilePictureRouter
		]))
	}
}
