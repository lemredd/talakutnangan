/* eslint-disable max-lines */
import type { PermissionMap, PermissionInfo } from "$/types/permission"
import type { DeserializedPageContext, ConditionalLinkInfo } from "$@/types/independent"

import BasePermissionGroup from "$/permissions/base"
import filterLinkInfos from "./filter_link_infos"

describe("Helper: Filter Link Infos", () => {
	it("must show free link for guest users", () => {
		const context: DeserializedPageContext = {
			"pageProps": {
				"userProfile": null
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				"kinds": null,
				"links": [
					{
						"icon": "a",
						"name": "A",
						"path": "/a",
						"viewportsAvailable": []
					}
				],
				"mustBeGuest": false,
				"permissionCombinations": null,
				"permissionGroup": null
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(1)
		expect(filteredLinkInfos[0]).toStrictEqual({
			"icon": "a",
			"name": "A",
			"path": "/a",
			"viewportsAvailable": []
		})
	})

	it("must show free link for authenticated users", () => {
		const context: DeserializedPageContext = {
			"pageProps": {
				"userProfile": {
					"data": {
						"department": {
							"data": {
								"acronym": "A",
								"fullName": "A",
								"id": "1",
								"mayAdmit": true,
								"type": "department"
							}
						},
						"email": "",
						"id": "1",
						"kind": "unreachable_employee",
						"name": "",
						"prefersDark": false,
						"roles": {
							"data": [
								{
									"auditTrailFlags": 0,
									"commentFlags": 0,
									"deletedAt": null,
									"departmentFlags": 0,
									"id": "2",
									"name": "B",
									"postFlags": 0,
									"profanityFlags": 0,
									"roleFlags": 0,
									"semesterFlags": 0,
									"tagFlags": 0,
									"type": "role",
									"userFlags": 0
								}
							]
						},
						"type": "user"
					},
					"meta": {
						"hasDefaultPassword": false
					}
				}
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				"kinds": null,
				"links": [
					{
						"icon": "a",
						"name": "A",
						"path": "/a",
						"viewportsAvailable": []
					}
				],
				"mustBeGuest": false,
				"permissionCombinations": null,
				"permissionGroup": null
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(1)
		expect(filteredLinkInfos[0]).toStrictEqual({
			"icon": "a",
			"name": "A",
			"path": "/a",
			"viewportsAvailable": []
		})
	})

	it("must show guest link for guest users", () => {
		const context: DeserializedPageContext = {
			"pageProps": {
				"userProfile": null
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				"kinds": null,
				"links": [
					{
						"icon": "a",
						"name": "A",
						"path": "/a",
						"viewportsAvailable": []
					}
				],
				"mustBeGuest": true,
				"permissionCombinations": null,
				"permissionGroup": null
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(1)
		expect(filteredLinkInfos[0]).toStrictEqual({
			"icon": "a",
			"name": "A",
			"path": "/a",
			"viewportsAvailable": []
		})
	})

	it("must hide guest link for authenticated users", () => {
		const context: DeserializedPageContext = {
			"pageProps": {
				"userProfile": {
					"data": {
						"department": {
							"data": {
								"acronym": "A",
								"fullName": "A",
								"id": "1",
								"mayAdmit": true,
								"type": "department"
							}
						},
						"email": "",
						"id": "1",
						"kind": "unreachable_employee",
						"name": "",
						"prefersDark": false,
						"roles": {
							"data": [
								{
									"auditTrailFlags": 0,
									"commentFlags": 0,
									"deletedAt": null,
									"departmentFlags": 0,
									"id": "2",
									"name": "B",
									"postFlags": 0,
									"profanityFlags": 0,
									"roleFlags": 0,
									"semesterFlags": 0,
									"tagFlags": 0,
									"type": "role",
									"userFlags": 0
								}
							]
						},
						"type": "user"
					},
					"meta": {
						"hasDefaultPassword": false
					}
				}
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				"kinds": null,
				"links": [
					{
						"icon": "a",
						"name": "A",
						"path": "/a",
						"viewportsAvailable": []
					}
				],
				"mustBeGuest": true,
				"permissionCombinations": null,
				"permissionGroup": null
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(0)
	})

	it("must show general authenticated link for authenticated users", () => {
		const context: DeserializedPageContext = {
			"pageProps": {
				"userProfile": {
					"data": {
						"department": {
							"data": {
								"acronym": "A",
								"fullName": "A",
								"id": "1",
								"mayAdmit": true,
								"type": "department"
							}
						},
						"email": "",
						"id": "1",
						"kind": "unreachable_employee",
						"name": "",
						"prefersDark": false,
						"roles": {
							"data": [
								{
									"auditTrailFlags": 0,
									"commentFlags": 0,
									"deletedAt": null,
									"departmentFlags": 0,
									"id": "2",
									"name": "B",
									"postFlags": 0,
									"profanityFlags": 0,
									"roleFlags": 0,
									"semesterFlags": 0,
									"tagFlags": 0,
									"type": "role",
									"userFlags": 0
								}
							]
						},
						"type": "user"
					},
					"meta": {
						"hasDefaultPassword": false
					}
				}
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				"kinds": [],
				"links": [
					{
						"icon": "a",
						"name": "A",
						"path": "/a",
						"viewportsAvailable": []
					}
				],
				"mustBeGuest": false,
				"permissionCombinations": [],
				"permissionGroup": null
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(1)
		expect(filteredLinkInfos[0]).toStrictEqual({
			"icon": "a",
			"name": "A",
			"path": "/a",
			"viewportsAvailable": []
		})
	})

	it("must hide general authenticated link for guest users", () => {
		const context: DeserializedPageContext = {
			"pageProps": {
				"userProfile": null
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				"kinds": [],
				"links": [
					{
						"icon": "a",
						"name": "A",
						"path": "/a",
						"viewportsAvailable": []
					}
				],
				"mustBeGuest": false,
				"permissionCombinations": [],
				"permissionGroup": null
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(0)
	})

	it("must show kind link for authenticated users", () => {
		const context: DeserializedPageContext = {
			"pageProps": {
				"userProfile": {
					"data": {
						"department": {
							"data": {
								"acronym": "A",
								"fullName": "A",
								"id": "1",
								"mayAdmit": true,
								"type": "department"
							}
						},
						"email": "",
						"id": "1",
						"kind": "unreachable_employee",
						"name": "",
						"prefersDark": false,
						"roles": {
							"data": [
								{
									"auditTrailFlags": 0,
									"commentFlags": 0,
									"deletedAt": null,
									"departmentFlags": 0,
									"id": "2",
									"name": "B",
									"postFlags": 0,
									"profanityFlags": 0,
									"roleFlags": 0,
									"semesterFlags": 0,
									"tagFlags": 0,
									"type": "role",
									"userFlags": 0
								}
							]
						},
						"type": "user"
					},
					"meta": {
						"hasDefaultPassword": false
					}
				}
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				"kinds": [ "unreachable_employee" ],
				"links": [
					{
						"icon": "a",
						"name": "A",
						"path": "/a",
						"viewportsAvailable": []
					}
				],
				"mustBeGuest": false,
				"permissionCombinations": null,
				"permissionGroup": null
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(1)
		expect(filteredLinkInfos[0]).toStrictEqual({
			"icon": "a",
			"name": "A",
			"path": "/a",
			"viewportsAvailable": []
		})
	})

	it("must hide kind link for different-kind users", () => {
		const context: DeserializedPageContext = {
			"pageProps": {
				"userProfile": {
					"data": {
						"department": {
							"data": {
								"acronym": "A",
								"fullName": "A",
								"id": "1",
								"mayAdmit": true,
								"type": "department"
							}
						},
						"email": "",
						"id": "1",
						"kind": "unreachable_employee",
						"name": "",
						"prefersDark": false,
						"roles": {
							"data": [
								{
									"auditTrailFlags": 0,
									"commentFlags": 0,
									"deletedAt": null,
									"departmentFlags": 0,
									"id": "2",
									"name": "B",
									"postFlags": 0,
									"profanityFlags": 0,
									"roleFlags": 0,
									"semesterFlags": 0,
									"tagFlags": 0,
									"type": "role",
									"userFlags": 0
								}
							]
						},
						"type": "user"
					},
					"meta": {
						"hasDefaultPassword": false
					}
				}
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				"kinds": [ "reachable_employee" ],
				"links": [
					{
						"icon": "a",
						"name": "A",
						"path": "/a",
						"viewportsAvailable": []
					}
				],
				"mustBeGuest": false,
				"permissionCombinations": null,
				"permissionGroup": null
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(0)
	})

	it("must hide kind link for guest users", () => {
		const context: DeserializedPageContext = {
			"pageProps": {
				"userProfile": null
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				"kinds": [ "unreachable_employee" ],
				"links": [
					{
						"icon": "a",
						"name": "A",
						"path": "/a",
						"viewportsAvailable": []
					}
				],
				"mustBeGuest": false,
				"permissionCombinations": null,
				"permissionGroup": null
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(0)
	})

	type GroupNameA = { "groupA": number }
	type AvailablePermissionsC = "a" | "b" | "c"

	class GroupA extends BasePermissionGroup<GroupNameA, AvailablePermissionsC> {
		get name(): string { return "userFlags" }
		get permissions(): PermissionMap<AvailablePermissionsC> {
			return new Map<AvailablePermissionsC, PermissionInfo<AvailablePermissionsC>>([
				[ "a", {
					"flag": 0x1,
					"permissionDependencies": []
				} ],
				[ "b", {
					"flag": 0x2,
					"permissionDependencies": []
				} ],
				[ "c", {
					"flag": 0x4,
					"permissionDependencies": []
				} ]
			])
		}
	}

	it("must show allowed link for authenticated users", () => {
		const permissionGroup = new GroupA()
		const context: DeserializedPageContext = {
			"pageProps": {
				"userProfile": {
					"data": {
						"department": {
							"data": {
								"acronym": "A",
								"fullName": "A",
								"id": "1",
								"mayAdmit": true,
								"type": "department"
							}
						},
						"email": "",
						"id": "1",
						"kind": "unreachable_employee",
						"name": "",
						"prefersDark": false,
						"roles": {
							"data": [
								{
									"auditTrailFlags": 0,
									"commentFlags": 0,
									"deletedAt": null,
									"departmentFlags": 0,
									"id": "2",
									"name": "B",
									"postFlags": 0,
									"profanityFlags": 0,
									"roleFlags": 0,
									"semesterFlags": 0,
									"tagFlags": 0,
									"type": "role",
									"userFlags": permissionGroup.generateMask("a")
								}
							]
						},
						"type": "user"
					},
					"meta": {
						"hasDefaultPassword": false
					}
				}
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				"kinds": null,
				"links": [
					{
						"icon": "a",
						"name": "A",
						"path": "/a",
						"viewportsAvailable": []
					}
				],
				"mustBeGuest": false,
				"permissionCombinations": [ [ "a" ] ],
				permissionGroup
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(1)
		expect(filteredLinkInfos[0]).toStrictEqual({
			"icon": "a",
			"name": "A",
			"path": "/a",
			"viewportsAvailable": []
		})
	})

	it("must hide allowed link for non-permitted users", () => {
		const permissionGroup = new GroupA()
		const context: DeserializedPageContext = {
			"pageProps": {
				"userProfile": {
					"data": {
						"department": {
							"data": {
								"acronym": "A",
								"fullName": "A",
								"id": "1",
								"mayAdmit": true,
								"type": "department"
							}
						},
						"email": "",
						"id": "1",
						"kind": "unreachable_employee",
						"name": "",
						"prefersDark": false,
						"roles": {
							"data": [
								{
									"auditTrailFlags": 0,
									"commentFlags": 0,
									"deletedAt": null,
									"departmentFlags": 0,
									"id": "2",
									"name": "B",
									"postFlags": 0,
									"profanityFlags": 0,
									"roleFlags": 0,
									"semesterFlags": 0,
									"tagFlags": 0,
									"type": "role",
									"userFlags": permissionGroup.generateMask("a")
								}
							]
						},
						"type": "user"
					},
					"meta": {
						"hasDefaultPassword": false
					}
				}
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				"kinds": null,
				"links": [
					{
						"icon": "a",
						"name": "A",
						"path": "/a",
						"viewportsAvailable": []
					}
				],
				"mustBeGuest": false,
				"permissionCombinations": [ [ "b" ] ],
				permissionGroup
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(0)
	})

	it("must hide allowed link for guest users", () => {
		const permissionGroup = new GroupA()
		const context: DeserializedPageContext = {
			"pageProps": {
				"userProfile": null
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				"kinds": null,
				"links": [
					{
						"icon": "a",
						"name": "A",
						"path": "/a",
						"viewportsAvailable": []
					}
				],
				"mustBeGuest": false,
				"permissionCombinations": [ [ "c" ] ],
				permissionGroup
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(0)
	})

	it("must show multiple allowed links for authenticated users", () => {
		const permissionGroup = new GroupA()
		const context: DeserializedPageContext = {
			"pageProps": {
				"userProfile": {
					"data": {
						"department": {
							"data": {
								"acronym": "A",
								"fullName": "A",
								"id": "1",
								"mayAdmit": true,
								"type": "department"
							}
						},
						"email": "",
						"id": "1",
						"kind": "unreachable_employee",
						"name": "",
						"prefersDark": false,
						"roles": {
							"data": [
								{
									"auditTrailFlags": 0,
									"commentFlags": 0,
									"deletedAt": null,
									"departmentFlags": 0,
									"id": "2",
									"name": "B",
									"postFlags": 0,
									"profanityFlags": 0,
									"roleFlags": 0,
									"semesterFlags": 0,
									"tagFlags": 0,
									"type": "role",
									"userFlags": permissionGroup.generateMask("a", "b")
								}
							]
						},
						"type": "user"
					},
					"meta": {
						"hasDefaultPassword": false
					}
				}
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				"kinds": null,
				"links": [
					{
						"icon": "a",
						"name": "A",
						"path": "/a",
						"viewportsAvailable": []
					}
				],
				"mustBeGuest": false,
				"permissionCombinations": [ [ "a" ] ],
				permissionGroup
			},
			{
				"kinds": null,
				"links": [
					{
						"icon": "b",
						"name": "B",
						"path": "/b",
						"viewportsAvailable": []
					}
				],
				"mustBeGuest": false,
				"permissionCombinations": [ [ "b" ] ],
				permissionGroup
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(2)
		expect(filteredLinkInfos[0]).toStrictEqual({
			"icon": "a",
			"name": "A",
			"path": "/a",
			"viewportsAvailable": []
		})
		expect(filteredLinkInfos[1]).toStrictEqual({
			"icon": "b",
			"name": "B",
			"path": "/b",
			"viewportsAvailable": []
		})
	})
})
