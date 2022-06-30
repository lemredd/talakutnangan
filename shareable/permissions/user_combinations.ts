import { Permissions } from "$/permissions/user_permissions"

export const READ_OWN: Permissions[] = [
	"view",
	"readOwnScope"
]

export const READ_ANYONE_ON_OWN_DEPARTMENT: Permissions[] = [
	"view",
	"readDepartmentScope"
]

export const READ_ANYONE_ON_ALL_DEPARTMENTS: Permissions[] = [
	"view",
	"readOverallScope"
]

export const IMPORT_USERS: Permissions[] = [
	"create",
	"writeOverallScope"
]

export const UPDATE_OWN_DATA: Permissions[] = [
	"update",
	"writeOwnScope"
]

export const UPDATE_ANYONE_ON_OWN_DEPARTMENT: Permissions[] = [
	"update",
	"writeDepartmentScope"
]

export const UPDATE_ANYONE_ON_ALL_DEPARTMENT: Permissions[] = [
	"update",
	"writeOverallScope"
]

export const RESET_PASSWORD: Permissions[] = [
	"resetPassword",
	"writeOverallScope"
]

export const ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT: Permissions[] = [
	"archiveAndRestore",
	"writeDepartmentScope"
]

export const ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT: Permissions[] = [
	"archiveAndRestore",
	"writeOverallScope"
]
