import { controllers as roleControllers } from "!%/api/user(id)/relationships/role/router"
import { controllers as signatureControllers } from "!%/api/user(id)/relationships/signature/router"
import { controllers as departmentControllers }
	from "!%/api/user(id)/relationships/department/router"
import { controllers as profilePictureControllers }
	from "!%/api/user(id)/relationships/profile_picture/router"

export const controllers = [
	...roleControllers,
	...signatureControllers,
	...departmentControllers,
	...profilePictureControllers
]
