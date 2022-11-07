import type { ConditionalLinkInfo } from "$@/types/independent"

import {
	DEPARTMENT_LIST,
	USER_LIST,
	ROLE_LIST,
	SEMESTER_LIST,
	AUDIT_TRAIL_LIST
} from "$/constants/template_page_paths"

import { READ as READ_AUDIT_TRAIL } from "$/permissions/audit_trail_combinations"
import { user, role, department, semester, auditTrail } from "$/permissions/permission_list"
import {
	CREATE as CREATE_ROLES,
	UPDATE as UPDATE_ROLES,
	ARCHIVE_AND_RESTORE as ARCHIVE_AND_RESTORE_ROLES
} from "$/permissions/role_combinations"
import {
	CREATE as CREATE_DEPARTMENTS,
	UPDATE as UPDATE_DEPARTMENTS,
	ARCHIVE_AND_RESTORE as ARCHIVE_AND_RESTORE_DEPARMENTS
} from "$/permissions/department_combinations"
import {
	CREATE as CREATE_SEMESTERS,
	UPDATE as UPDATE_SEMESTERS,
	ARCHIVE_AND_RESTORE as ARCHIVE_AND_RESTORE_SEMESTERS
} from "$/permissions/semester_combinations"
import {
	IMPORT_USERS,
	RESET_PASSWORD,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS,
	ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT,
	ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT
} from "$/permissions/user_combinations"

const linkInfos: ConditionalLinkInfo<any, any>[] = [
	{
		"kinds": [],
		"links": [
			{
				"icon": "",
				"name": "Users",
				"path": USER_LIST,
				"viewportsAvailable": [ "mobile", "desktop" ]
			}
		],
		"mustBeGuest": false,
		"permissionCombinations": [
			IMPORT_USERS,
			RESET_PASSWORD,
			UPDATE_ANYONE_ON_OWN_DEPARTMENT,
			UPDATE_ANYONE_ON_ALL_DEPARTMENTS,
			ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT,
			ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT
		],
		"permissionGroup": user
	},
	{
		"kinds": [],
		"links": [
			{
				"icon": "",
				"name": "Roles",
				"path": ROLE_LIST,
				"viewportsAvailable": [ "mobile", "desktop" ]
			}
		],
		"mustBeGuest": false,
		"permissionCombinations": [
			CREATE_ROLES,
			UPDATE_ROLES,
			ARCHIVE_AND_RESTORE_ROLES
		],
		"permissionGroup": role
	},
	{
		"kinds": [],
		"links": [
			{
				"icon": "",
				"name": "Departments",
				"path": DEPARTMENT_LIST,
				"viewportsAvailable": [ "mobile", "desktop" ]
			}
		],
		"mustBeGuest": false,
		"permissionCombinations": [
			CREATE_DEPARTMENTS,
			UPDATE_DEPARTMENTS,
			ARCHIVE_AND_RESTORE_DEPARMENTS
		],
		"permissionGroup": department
	},
	{
		"kinds": [],
		"links": [
			{
				"icon": "",
				"name": "Semesters",
				"path": SEMESTER_LIST,
				"viewportsAvailable": [ "mobile", "desktop" ]
			}
		],
		"mustBeGuest": false,
		"permissionCombinations": [
			CREATE_SEMESTERS,
			UPDATE_SEMESTERS,
			ARCHIVE_AND_RESTORE_SEMESTERS
		],
		"permissionGroup": semester
	},
	{
		"kinds": null,
		"links": [
			{
				"icon": "list_alt",
				"name": "Audit trails",
				"path": AUDIT_TRAIL_LIST,
				"viewportsAvailable": [ "mobile", "desktop" ]
			}
		],
		"mustBeGuest": false,
		"permissionCombinations": [
			READ_AUDIT_TRAIL
		],
		"permissionGroup": auditTrail
	}
]

export default linkInfos
