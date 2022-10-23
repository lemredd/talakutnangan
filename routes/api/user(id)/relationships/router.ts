import Router from "!/bases/router"
import RoleRouter, { controllers as roleControllers }
	from "!%/api/user(id)/relationships/role/router"
import SignatureRouter, { controllers as signatureControllers }
	from "!%/api/user(id)/relationships/signature/router"
import instantiateSimultaneously from "!/helpers/instantiate_simultaneously"
import DepartmentRouter, { controllers as departmentControllers }
	from "!%/api/user(id)/relationships/department/router"
import ProfilePictureRouter, { controllers as profilePictureControllers }
	from "!%/api/user(id)/relationships/profile_picture/router"

export const controllers = [
	...roleControllers,
	...signatureControllers,
	...departmentControllers,
	...profilePictureControllers
]

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
