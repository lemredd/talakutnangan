import type { ConditionalLinkInfo } from "$@/types/independent"

import { USER_LIST, AUDIT_TRAIL_LIST } from "$/constants/template_page_paths"

import { READ } from "$/permissions/audit_trail_combinations"
import { user, post, auditTrail } from "$/permissions/permission_list"
import {
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/post_combinations"
import {
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS,
	ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT,
	ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT,
	IMPORT_USERS,
	RESET_PASSWORD
} from "$/permissions/user_combinations"

const linkInfos: ConditionalLinkInfo<any, any>[] = [
	{
		"kinds": null,
		"links": [
			{
				"icon": "account_circle",
				"name": "Log in",
				"path": "/user/log_in",
				"viewportsAvailable": [ "mobile", "desktop" ]
			}
		],
		"mustBeGuest": true,
		"permissionCombinations": null,
		"permissionGroup": null
	},
	{
		"kinds": [],
		"links": [
			{
				"icon": "account_circle",
				"name": "User Settings",
				"path": "/settings",
				"viewportsAvailable": [ "mobile" ]
			}
		],
		"mustBeGuest": false,
		"permissionCombinations": [],
		"permissionGroup": null
	},
	{
		"kinds": [],
		"links": [
			{
				"icon": "forum",
				"name": "Forum",
				"path": "/forum",
				"viewportsAvailable": [ "mobile", "desktop" ]
			}
		],
		"mustBeGuest": false,
		"permissionCombinations": [
			READ_ANYONE_ON_OWN_DEPARTMENT,
			READ_ANYONE_ON_ALL_DEPARTMENTS
		],
		"permissionGroup": post
	},
	{
		"kinds": [ "student", "reachable_employee" ],
		"links": [
			{
				"icon": "chat",
				"name": "Consultations",
				"path": "/consultation",
				"viewportsAvailable": [ "mobile", "desktop" ]
			}
		],
		"mustBeGuest": false,
		"permissionCombinations": null,
		"permissionGroup": null
	},
	{
		"kinds": null,
		"links": [
			{
				"icon": "group",
				"name": "Manage Users",
				"path": USER_LIST,
				"viewportsAvailable": [ "mobile", "desktop" ]
			}
		],
		"mustBeGuest": false,
		"permissionCombinations": [
			UPDATE_ANYONE_ON_OWN_DEPARTMENT,
			UPDATE_ANYONE_ON_ALL_DEPARTMENTS,
			ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT,
			ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT,
			IMPORT_USERS,
			RESET_PASSWORD
		],
		"permissionGroup": user
	},
	{
		"kinds": null,
		"links": [
			{
				"icon": "list_alt",
				"name": "See Audit Trail",
				"path": AUDIT_TRAIL_LIST,
				"viewportsAvailable": [ "mobile", "desktop" ]
			}
		],
		"mustBeGuest": false,
		"permissionCombinations": [
			READ
		],
		"permissionGroup": auditTrail
	}
]

export default linkInfos
