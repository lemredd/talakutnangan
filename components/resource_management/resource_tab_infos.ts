import type { ConditionalLinkInfo } from "$@/types/independent"

import { user, role, department } from "$/permissions/permission_list"
import { UPDATE as UPDATE_ROLES } from "$/permissions/role_combinations"
import { UPDATE as UPDATE_DEPARTMENTS } from "$/permissions/department_combinations"
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
				"path": "/user/list",
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
				"name": "Departments",
				"path": "/department/list",
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
				"name": "Roles",
				"path": "/role/list",
				"viewportsAvailable": [ "mobile", "desktop" ]
			}
		],
		"mustBeGuest": false,
		"permissionCombinations": [ UPDATE_ROLES ],
		"permissionGroup": role
	}
]

export default linkInfos
