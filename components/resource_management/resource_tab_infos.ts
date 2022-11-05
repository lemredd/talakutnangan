import type { ConditionalLinkInfo } from "$@/types/independent"

import {
	DEPARTMENT_LIST,
	USER_LIST,
	ROLE_LIST,
	SEMESTER_LIST
} from "$/constants/template_page_paths"

import { user, role, department, semester } from "$/permissions/permission_list"
import { UPDATE as UPDATE_ROLES } from "$/permissions/role_combinations"
import { UPDATE as UPDATE_DEPARTMENTS } from "$/permissions/department_combinations"
import {
	UPDATE as UPDATE_SEMESTERS,
	ARCHIVE_AND_RESTORE as ARCHIVE_AND_RESTORE_SEMESTERS
} from "$/permissions/semester_combinations"
import {
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
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
			UPDATE_ANYONE_ON_OWN_DEPARTMENT,
			UPDATE_ANYONE_ON_ALL_DEPARTMENTS
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
		"permissionCombinations": [ UPDATE_ROLES ],
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
		"permissionCombinations": [ UPDATE_DEPARTMENTS ],
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
			UPDATE_SEMESTERS,
			ARCHIVE_AND_RESTORE_SEMESTERS
		],
		"permissionGroup": semester
	}
]

export default linkInfos
