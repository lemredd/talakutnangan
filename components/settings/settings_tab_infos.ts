import type { ConditionalLinkInfo } from "$@/types/independent"

const linkInfos: ConditionalLinkInfo<any, any>[] = [
	{
		"kinds": [],
		"links": [
			{
				"icon": "",
				"name": "Account",
				"path": "/settings/account",
				"viewportsAvailable": [ "mobile", "desktop" ]
			},
			{
				"icon": "",
				"name": "Profile",
				"path": "/settings/profile",
				"viewportsAvailable": [ "mobile", "desktop" ]
			}
		],
		"mustBeGuest": false,
		"permissionCombinations": null,
		"permissionGroup": null
	}
]

export default linkInfos
