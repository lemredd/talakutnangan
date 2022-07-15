<template>
	<div class="links mobile">

		<RoleLinksList purpose="role-navigation" @toggle="toggleRoleLinks">
			<template #toggler>
				<span id="menu-btn" class="material-icons">menu</span>
			</template>

			<template #default>
				<div class="role-links flex flex-col">
					<Link v-for="link in determineRoleLinks.links" :key="link.name" :href="link.path">
						<span class="material-icons">
							{{ link.icon }}
						</span>
						<span class="link-name">{{ link.name }}</span>
					</Link>

				</div>
				<a role="button" href="/logout" id="logout-btn" class="flex items-center">
						<span class="material-icons">logout</span>
						Logout
				</a>
			</template>
		</RoleLinksList>
	</div>

	<div class="links desktop">
		<Link v-for="link in determineRoleLinks.links" :key="link.name" :href="link.path">
			<span class="material-icons">
				{{ link.icon }}
			</span>
		</Link>
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

		.link {
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

			.link[href="/settings"], .link[href="/notifications"] {
				display: none;
			}
		}
	}
}
</style>

<script setup lang="ts">
import { computed, inject, ref, Ref } from "vue"

import type { PageProps } from "#/types"
import type { ConditionalLinkInfo } from "$@/types/independent"

import Link from "@/Link.vue"
import RoleLinksList from "@/Dropdown.vue"
import RequestEnvironment from "$/helpers/request_environment"

const emit = defineEmits(["toggle"])

// Props
type Props = {
	pageProps: PageProps,
	role: string
}
const { role } = defineProps<Props>()

// Role
const isRoleGuest = role === "guest"
const areRoleLinksShown = ref(false)
const linkInfos: ConditionalLinkInfo<any, any>[] = [
	{
		mustBeGuest: true,
		kinds: null,
		permissionCombinations: null,
		permissionGroup: null,
		links: [
			{
				name: "Log in",
				path: "/log_in",
				icon: "account_circle"
			}
		]
	},
	{
		mustBeGuest: false,
		kinds: null,
		permissionCombinations: [],
		permissionGroup: null,
		links: [
			{
				name: "Notifications",
				path: "/notifications",
				icon: "notifications"
			},
			{
				name: "Forum",
				path: "/forum",
				icon: "forum"
			},
			{
				name: "User Settings",
				path: "/settings",
				icon: "account_circle"
			}
		]
	},
	{
		mustBeGuest: false,
		kinds: [ "student", "reachable_employee" ],
		permissionCombinations: [],
		permissionGroup: null,
		links: [
			{
				name: "Consultations",
				path: "/consultations",
				icon: "chat"
			}
		]
	}
]

const linksSpecifiers = [
	{
		role: "guest", // Converted
		links: [
			{
				name: "login",
				path: "/log_in",
				icon: "account_circle"
			}
		]
	},
	{
		role: "student_or_employee",
		links: [
			{// Converted
				name: "Notifications",
				path: "/notifications",
				icon: "notifications"
			},
			{// Converted
				name: "Consultations",
				path: "/consultations",
				icon: "chat"
			},
			{// Converted
				name: "Forum",
				path: "/forum",
				icon: "forum"
			},
			{// Converted
				name: "User Settings",
				path: "/settings",
				icon: "account_circle"
			}
		]
	},
	{
		role: "user_manager",
		links: [
			{// Converted
				name: "Notifications",
				path: "/notifications",
				icon: "notifications"
			},
			{
				name: "Manage Users",
				path: "/manage",
				icon: "group"
			},
			{// Converted
				name: "Consultations",
				path: "/consultations",
				icon: "chat"
			},
			{// Converted
				name: "Forum",
				path: "/forum",
				icon: "forum"
			},
			{// Converted
				name: "User Settings",
				path: "/settings",
				icon: "account_circle"
			}
		]
	},
	{
		role: "admin",
		links: [
			{// Converted
				name: "Notifications",
				path: "/notifications",
				icon: "notifications"
			},
			{
				name: "Manage Users",
				path: "/manage",
				icon: "group"
			},
			{// Converted
				name: "Forum",
				path: "/forum",
				icon: "forum"
			},
			{// Converted
				name: "User Settings",
				path: "/settings",
				icon: "account_circle"
			}
		]
	}
]
const determineRoleLinks = computed(function()  {
	return linksSpecifiers.filter(specifier => specifier.role === role)[0]
})
const rawBodyClasses = inject("bodyClasses") as Ref<string[]>

function toggleRoleLinks() {
	if (RequestEnvironment.isOnTest) emit("toggle")
	areRoleLinksShown.value = !areRoleLinksShown.value
	disableScroll()
}

function disableScroll() {
	const bodyClasses = new Set([ ...rawBodyClasses.value ])
	if (!bodyClasses.has("unscrollable")) bodyClasses.add("unscrollable")
	else bodyClasses.delete("unscrollable")

	rawBodyClasses.value = [...bodyClasses]
}
</script>
