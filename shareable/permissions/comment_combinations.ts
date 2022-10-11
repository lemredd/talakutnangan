import { Permissions } from "$/permissions/comment"

export const READ_ANYONE_ON_OWN_DEPARTMENT: Permissions[] = [
	"view",
	"readDepartmentScope"
]

export const READ_ANYONE_ON_ALL_DEPARTMENTS: Permissions[] = [
	"view",
	"readOverallScope"
]

export const CREATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT: Permissions[] = [
	"create",
	"writeOwnScope"
]

export const CREATE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT: Permissions[] = [
	"create",
	"writeDepartmentScope"
]

export const CREATE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT: Permissions[] = [
	"create",
	"writeOverallScope"
]

export const UPDATE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT: Permissions[] = [
	"update",
	"writeOwnScope"
]

export const UPDATE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT: Permissions[] = [
	"update",
	"writeDepartmentScope"
]

export const UPDATE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT: Permissions[] = [
	"update",
	"writeOverallScope"
]

export const ARCHIVE_AND_RESTORE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT: Permissions[] = [
	"archiveAndRestore",
	"writeOwnScope"
]

export const ARCHIVE_AND_RESTORE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT: Permissions[] = [
	"archiveAndRestore",
	"writeDepartmentScope"
]

export const ARCHIVE_AND_RESTORE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT: Permissions[] = [
	"archiveAndRestore",
	"writeOverallScope"
]
