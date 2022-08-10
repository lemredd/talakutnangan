import Router from "!/bases/router"
import UserRouter from "!%/api/user/router"
import RoleRouter from "!%/api/role/router"
import UserBindedRouter from "!%/api/user(id)/router"
import SignatureRouter from "!%/api/signature/router"
import DepartmentRouter from "!%/api/department/router"
import AuditTrailRouter from "!%/api/audit_trail/router"
import ProfilePictureRouter from "!%/api/profile_picture/router"

export default class extends Router {
	constructor() {
		super()

		this.useRouters([
			new UserRouter(),
			new RoleRouter(),
			new SignatureRouter(),
			new AuditTrailRouter(),
			new DepartmentRouter(),
			new UserBindedRouter(),
			new ProfilePictureRouter()
		])
	}
}
