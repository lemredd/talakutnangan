import type { ConditionalLinkInfo } from "$@/types/independent"

import { user, post } from "$/permissions/permission_list"
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
				"path": "/user/log_in"
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
				"icon": "notifications",
				"name": "Notifications",
				"path": "/notifications"
			},
			{
				"icon": "account_circle",
				"name": "User Settings",
				"path": "/settings"
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
				"path": "/forum"
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
				"path": "/consultation"
			}
		],
		"mustBeGuest": false,
		"permissionCombinations": [],
		"permissionGroup": null
	},
	{
		"kinds": null,
		"links": [
			{
				"icon": "group",
				"name": "Manage Users",
				"path": "/manage"
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
	}
]

export default linkInfos
