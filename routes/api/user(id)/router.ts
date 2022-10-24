import PatchUpdatePassword from "!%/api/user(id)/update_password.patch"
import { controllers as relationshipControllers } from "!%/api/user(id)/relationships/router"

export const controllers = [
	PatchUpdatePassword,
	...relationshipControllers
]
