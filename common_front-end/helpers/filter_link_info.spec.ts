import type { PermissionMap, PermissionInfo } from "$/types/server"
import type { DeserializedPageContext, ConditionalLinkInfo } from "$@/types/independent"

import BasePermissionGroup from "$/permissions/base"
import filterLinkInfos from "./filter_link_infos"

describe("Helper: Filter Link Infos", () => {
	it("must show free link for guest users", async () => {
		const context: DeserializedPageContext = {
			pageProps: {
				userProfile: null
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				mustBeGuest: false,
				kind: null,
				permissionCombinations: null,
				permissionGroup: null,
				links: [
					{
						"icon": "a",
						"name": "A",
						"path": "/a"
					}
				]
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(1)
		expect(filteredLinkInfos[0]).toStrictEqual({
			"icon": "a",
			"name": "A",
			"path": "/a"
		})
	})

	it("must show free link for authenticated users", async () => {
		const context: DeserializedPageContext = {
			pageProps: {
				userProfile: {
					data: {
						type: "user",
						id: 1,
						kind: "student",
						role: {
							data: [
								{
									type: "role",
									id: 2,
									name: "B"
								}
							]
						}
					}
				}
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				mustBeGuest: false,
				kind: null,
				permissionCombinations: null,
				permissionGroup: null,
				links: [
					{
						"icon": "a",
						"name": "A",
						"path": "/a"
					}
				]
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(1)
		expect(filteredLinkInfos[0]).toStrictEqual({
			"icon": "a",
			"name": "A",
			"path": "/a"
		})
	})

	it("must show guest link for guest users", async () => {
		const context: DeserializedPageContext = {
			pageProps: {
				userProfile: null
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				mustBeGuest: true,
				kind: null,
				permissionCombinations: null,
				permissionGroup: null,
				links: [
					{
						"icon": "a",
						"name": "A",
						"path": "/a"
					}
				]
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(1)
		expect(filteredLinkInfos[0]).toStrictEqual({
			"icon": "a",
			"name": "A",
			"path": "/a"
		})
	})

	it("must hide guest link for authenticated users", async () => {
		const context: DeserializedPageContext = {
			pageProps: {
				userProfile: {
					data: {
						type: "user",
						id: 1,
						kind: "student",
						role: {
							data: [
								{
									type: "role",
									id: 2,
									name: "B"
								}
							]
						}
					}
				}
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				mustBeGuest: true,
				kind: null,
				permissionCombinations: null,
				permissionGroup: null,
				links: [
					{
						"icon": "a",
						"name": "A",
						"path": "/a"
					}
				]
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(0)
	})

	type GroupNameA = { "groupA": number }
	type AvailablePermissionsC = "a" | "b" | "c"

	class GroupA extends BasePermissionGroup<GroupNameA, AvailablePermissionsC> {
		get name(): string { return "groupA" }
		get permissions(): PermissionMap<AvailablePermissionsC> {
			return new Map<AvailablePermissionsC, PermissionInfo<AvailablePermissionsC>>([
				[ "a", { flag: 0x1, permissionDependencies: [] } ],
				[ "b", { flag: 0x2, permissionDependencies: [] } ],
				[ "c", { flag: 0x4, permissionDependencies: [] } ]
			])
		}
	}

	it("must show allowed link for authenticated users", async () => {
		const permissionGroup = new GroupA()
		const context: DeserializedPageContext = {
			pageProps: {
				userProfile: {
					data: {
						type: "user",
						id: 1,
						kind: "student",
						role: {
							data: [
								{
									type: "role",
									id: 2,
									name: "B",
									groupA: permissionGroup.generateMask("a")
								}
							]
						}
					}
				}
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				mustBeGuest: false,
				kind: null,
				permissionCombinations: [ [ "a" ] ],
				permissionGroup,
				links: [
					{
						"icon": "a",
						"name": "A",
						"path": "/a"
					}
				]
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(1)
		expect(filteredLinkInfos[0]).toStrictEqual({
			"icon": "a",
			"name": "A",
			"path": "/a"
		})
	})

	it("must hide allowed link for non-permitted users", async () => {
		const permissionGroup = new GroupA()
		const context: DeserializedPageContext = {
			pageProps: {
				userProfile: {
					data: {
						type: "user",
						id: 1,
						kind: "student",
						role: {
							data: [
								{
									type: "role",
									id: 2,
									name: "B",
									groupA: permissionGroup.generateMask("a")
								}
							]
						}
					}
				}
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				mustBeGuest: false,
				kind: null,
				permissionCombinations: [ [ "b" ] ],
				permissionGroup,
				links: [
					{
						"icon": "a",
						"name": "A",
						"path": "/a"
					}
				]
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(0)
	})

	it("must hide allowed link for guest users", async () => {
		const permissionGroup = new GroupA()
		const context: DeserializedPageContext = {
			pageProps: {
				userProfile: null
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				mustBeGuest: false,
				kind: null,
				permissionCombinations: [ [ "c" ] ],
				permissionGroup,
				links: [
					{
						"icon": "a",
						"name": "A",
						"path": "/a"
					}
				]
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(0)
	})

	it("must show multiple allowed links for authenticated users", async () => {
		const permissionGroup = new GroupA()
		const context: DeserializedPageContext = {
			pageProps: {
				userProfile: {
					data: {
						type: "user",
						id: 1,
						kind: "student",
						role: {
							data: [
								{
									type: "role",
									id: 2,
									name: "B",
									groupA: permissionGroup.generateMask("a", "b")
								}
							]
						}
					}
				}
			}
		}
		const linkInfos: ConditionalLinkInfo<any, any>[] = [
			{
				mustBeGuest: false,
				kind: null,
				permissionCombinations: [ [ "a" ] ],
				permissionGroup,
				links: [
					{
						"icon": "a",
						"name": "A",
						"path": "/a"
					}
				]
			},
			{
				mustBeGuest: false,
				kind: null,
				permissionCombinations: [ [ "b" ] ],
				permissionGroup,
				links: [
					{
						"icon": "b",
						"name": "B",
						"path": "/b"
					}
				]
			}
		]

		const filteredLinkInfos = filterLinkInfos(context, linkInfos)

		expect(filteredLinkInfos).toHaveLength(2)
		expect(filteredLinkInfos[0]).toStrictEqual({
			"icon": "a",
			"name": "A",
			"path": "/a"
		})
		expect(filteredLinkInfos[1]).toStrictEqual({
			"icon": "b",
			"name": "B",
			"path": "/b"
		})
	})
})
