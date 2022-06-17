<template>
	<div class="links mobile" :class="role">

		<button id="menu-btn" class="material-icons" @click="toggleRoleLinks">menu</button>
		<RoleLinksList v-if="areRoleLinksShown" @close="toggleRoleLinks">
			<div class="role-links">
				<Link v-for="link in determineRoleLinks.links" :key="link.name" :href="link.path">
					<span class="material-icons">
						{{ link.icon }}
					</span>
					<span class="link-name">{{ link.name }}</span>
				</Link>

			</div>
			<a role="button" href="/logout" id="logout-btn">
					<span class="material-icons">logout</span>
					Logout
			</a>
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
.links.desktop {
	display: none;
}


.links {
	height: 100%;
	display: flex;
	align-items: center;

	.dropdown-container {
		position: fixed;
		inset: 56px 0 0;
	}

	.role-links {
		display: flex;
		flex-direction: column;
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
		display: flex;
		align-items: center;
		padding: .5em 1em;
	}

	.account-controls {
		padding-left: 1em;
	}
}

@media (min-width: 640px) {
	.links.mobile {
		display: none;
	}
	.links.desktop {
		display: flex;

		.link[href="/notifications"] {
			display: none;
		}
	}
}
</style>

<script setup lang="ts">
import { computed, inject, ref, Ref } from "vue"
import Link from "@/Link.vue"
import RoleLinksList from "@/Dropdown.vue"
import RequestEnvironment from "$/helpers/request_environment"

const emit = defineEmits(["toggle"])

// Props
type Props = {
	role: string
}
const { role } = defineProps<Props>()

// Role
const isRoleGuest = role === "guest"
const areRoleLinksShown = ref(false)
const linksSpecifiers = [
	{
		role: "guest",
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
			{
				name: "Notifications",
				path: "/notifications",
				icon: "notifications"
			},
			{
				name: "Consultations",
				path: "/consultations",
				icon: "chat"
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
		role: "user_manager",
		links: [
			{
				name: "Notifications",
				path: "/notifications",
				icon: "notifications"
			},
			{
				name: "Manage Users",
				path: "/manage",
				icon: "group"
			},
			{
				name: "Consultations",
				path: "/consultations",
				icon: "chat"
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
		role: "admin",
		links: [
			{
				name: "Notifications",
				path: "/notifications",
				icon: "notifications"
			},
			{
				name: "Manage Users",
				path: "/manage",
				icon: "group"
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
