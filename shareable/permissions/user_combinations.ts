import { Permissions } from "$/permissions/user_permissions"

export const LIST_USERS_ON_OWN_DEPARTMENT: Permissions[] = [
	"view",
	"readDepartmentScope"
]

export const LIST_USERS_ON_ALL_DEPARTMENT: Permissions[] = [
	"view",
	"readOverallScope"
]

export const UPDATE_USERS_ON_OWN_DEPARTMENT: Permissions[] = [
	"update",
	"writeDepartmentScope"
]

export const UPDATE_USERS_ON_ALL_DEPARTMENT: Permissions[] = [
	"update",
	"writeOverallScope"
]

export const IMPORT_USERS: Permissions[] = [
	"create",
	"writeOverallScope"
]

export const RESET_PASSWORD: Permissions[] = [
	"resetPassword",
	"writeOverallScope"
]
