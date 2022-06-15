<template>
	<div class="links" :class="[role, /* linkClasses */]">

		<button id="menu-btn" class="material-icons" @click="toggleRoleLinks">menu</button>
		<RoleLinksList v-show="areRoleLinksShown" @close="toggleRoleLinks">
			<div class="role-links">
				<div class="overlay"></div>
				<Link v-for="link in determineRoleLinks.links" :key="link.name" :href="link.path">
					<span class="material-icons">
						{{ link.icon }}
					</span>
					<span class="link-name">{{ link.name }}</span>
				</Link>
				<a role="button" href="/logout" id="logout-btn" class="bg-gray-600">
					<span class="material-icons">logout</span>
					Logout
				</a>
			</div>
		</RoleLinksList>
	</div>
</template>

<style lang="scss">
body.unscrollable {
	// smelly
	overflow-y: hidden;
}

.links {
	height: 100%;
	display: flex;
	align-items: center;

	.dropdown-container {
		padding-top: 1em;
		position: fixed;
		inset: 56px 0 0;
	}

	.role-links {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
		height: 100%;

		.overlay {
			position: absolute;
			width: 100%; height: 100vh;
			z-index: -1;
		}

		#logout-btn {
			border-radius: 5px;
			display: flex;
				align-items: center;
			margin-top: 1em;
			padding: .5em 1em;
		}
	}

	.account-controls {
		padding-left: 1em;
	}
}

</style>

<script setup lang="ts">
import { computed, inject, ref, Ref } from "vue"
import Link from "@/Link.vue"
import RoleLinksList from "@/Dropdown.vue"

// Props
type Props = {
	role: string
}
const props = defineProps<Props>()
const role = props.role

// Viewport
// Currently, window class is undefined
// const linkClasses = ""
// const isViewportGreaterThanMobile = computed(function() {
// 	return screenWidth.value > 640
// })
// window.onresize = () => {
// //   screenWidth.value = window.innerWidth
// }

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
const body = inject("body") as Ref<HTMLBodyElement>

function toggleRoleLinks() {
	areRoleLinksShown.value = !areRoleLinksShown.value

	// smelly!
	body.value.classList.toggle("unscrollable")
}
</script>
