<template>
	<!-- TODO: Refactor all WindiCSS inline classes using @apply directive -->
	<div class="links mobile">
		<RoleLinksList
			purpose="role-navigation"
			@toggle="toggleRoleLinks"
			@resize="toggleRoleLinks">
			<template #toggler>
				<span id="menu-btn" class="material-icons">menu</span>
			</template>

			<template #default>
				<div class="role-links flex flex-col">
					<Anchor
						v-for="link in roleLinks"
						:key="link.name"
						:href="link.path">
						<span class="material-icons">
							{{ link.icon }}
						</span>
						<span class="link-name">{{ link.name }}</span>
					</Anchor>
				</div>
				<LogOutBtn class="flex items-center"/>
			</template>
		</RoleLinksList>
	</div>

	<div class="links desktop">
		<Anchor
			v-for="link in roleLinks"
			:key="link.name"
			:href="link.path">
			<span class="material-icons">
				{{ link.icon }}
			</span>
		</Anchor>
	</div>
</template>

<style lang="scss">
body.unscrollable {
	overflow-y: hidden;
}

.links {
	height: 100%;

	&.mobile {
		@apply flex items-center;
	}
	&.desktop {
		display: none;
	}

	.dropdown-container {
		position: fixed;
		inset: 56px 0 0;
	}

	.role-links {
		height: calc(100% - 56px);

		.overlay {
			position: absolute;
			width: 100%; height: 100vh;
			z-index: -1;
		}

		.anchor {
			padding: .5em;

			.material-icons {
				margin-right: .5em;
			}

		}
	}
	#logout-btn {
		border-radius: 5px;
		padding: .5em 1em;
	}

	.account-controls {
		padding-left: 1em;
	}
}

@media (min-width: 640px) {
	.links{
		&.mobile {
			display: none;
		}
		&.desktop {
			@apply flex;

			.anchor[href="/settings"], .anchor[href="/notifications"] {
				display: none;
			}
		}
	}
}
</style>

<script setup lang="ts">
import { computed, inject, Ref } from "vue"

import type { DeserializedPageContext, ConditionalLinkInfo } from "$@/types/independent"

import sanitizeArray from "$@/helpers/sanitize_array"
import filterLinkInfo from "$@/helpers/filter_link_infos"
import RequestEnvironment from "$/helpers/request_environment"

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

import Anchor from "@/anchor.vue"
import RoleLinksList from "@/page_shell/dropdown.vue"
import LogOutBtn from "@/authentication/log_out_btn.vue"

const emit = defineEmits([ "toggle" ])
const pageContext = inject("pageContext") as DeserializedPageContext

// Role
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

const roleLinks = computed(() => filterLinkInfo(pageContext, linkInfos))

const rawBodyClasses = inject("bodyClasses") as Ref<string[]>

function disableScroll() {
	const bodyClasses = Array.from(rawBodyClasses.value)
	if (bodyClasses.includes("unscrollable")) {
		delete bodyClasses[bodyClasses.indexOf("unscrollable")]
	} else {
		bodyClasses.push("unscrollable")
	}

	rawBodyClasses.value = sanitizeArray(bodyClasses)
}

function toggleRoleLinks() {
	if (RequestEnvironment.isOnTest) emit("toggle")
	disableScroll()
}
</script>
