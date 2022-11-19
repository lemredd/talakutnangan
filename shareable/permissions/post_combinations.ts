/**
 * @mdescription Naming of some permission combinations is based on proxemics.
 *
 * @see https://www.scienceofpeople.com/proxemics/
 */
import { Permissions } from "$/permissions/post"

export const READ_ANYONE_ON_OWN_DEPARTMENT: Permissions[] = [
	"view",
	"readDepartmentScope"
]

export const READ_ANYONE_ON_ALL_DEPARTMENTS: Permissions[] = [
	"view",
	"readOverallScope"
]

export const CREATE_ONESELF_ON_OWN_DEPARTMENT: Permissions[] = [
	"create",
	"writeOwnScope"
]

export const CREATE_PERSONAL_POST_ON_OWN_DEPARTMENT: Permissions[] = [
	"create",
	"writeOwnScope"
]

export const CREATE_SOCIAL_POST_ON_OWN_DEPARTMENT: Permissions[] = [
	"create",
	"writeDepartmentScope"
]

export const CREATE_PUBLIC_POST_ON_ANY_DEPARTMENT: Permissions[] = [
	"create",
	"writeOverallScope"
]

export const UPDATE_PERSONAL_POST_ON_OWN_DEPARTMENT: Permissions[] = [
	"update",
	"writeOwnScope"
]

export const UPDATE_SOCIAL_POST_ON_OWN_DEPARTMENT: Permissions[] = [
	"update",
	"writeDepartmentScope"
]

export const UPDATE_PUBLIC_POST_ON_ANY_DEPARTMENT: Permissions[] = [
	"update",
	"writeOverallScope"
]

export const ARCHIVE_AND_RESTORE_PERSONAL_POST_ON_OWN_DEPARTMENT: Permissions[] = [
	"archiveAndRestore",
	"writeOwnScope"
]

export const ARCHIVE_AND_RESTORE_SOCIAL_POST_ON_OWN_DEPARTMENT: Permissions[] = [
	"archiveAndRestore",
	"writeDepartmentScope"
]

export const ARCHIVE_AND_RESTORE_PUBLIC_POST_ON_ANY_DEPARTMENT: Permissions[] = [
	"archiveAndRestore",
	"writeOverallScope"
]

export const TAG_PERSONAL_POST_ON_OWN_DEPARTMENT: Permissions[] = [
	"tag",
	"writeOwnScope"
]

export const TAG_SOCIAL_POST_ON_OWN_DEPARTMENT: Permissions[] = [
	"tag",
	"writeDepartmentScope"
]

export const TAG_PUBLIC_POST_ON_ANY_DEPARTMENT: Permissions[] = [
	"tag",
	"writeOverallScope"
]
