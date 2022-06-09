<template>
	<div class="links" :class="[role, /* linkClasses */]">
		<Notifications v-if="!isRoleGuest"></Notifications>

		<div v-if="!isRoleGuest" class="account-controls">
			<a role="button" class="material-icons">account_circle</a>
			<span class="material-icons">expand_more</span>
		<button class="material-icons" @click="toggleRoleLinks">menu</button>
		<div v-show="areRoleLinksShown" class="role-links">
			<div class="overlay bg-dark-700 bg-opacity-60" @click="toggleRoleLinks"></div>
			<Link v-for="link in determineRoleLinks.links" :key="link.name" :href="link.path">
				<span class="material-icons">
					{{ link.icon }}
				</span>
			</Link>
		</div>
	</div>
</template>

<style scoped lang="scss">
.links {
	height: 100%;
	display: flex;
	align-items: center;
	.role-links {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: fixed;
		width: 100%;
		top: 72px; left: 0;
		.overlay {
			position: absolute;
			width: 100%; height: 100vh;
			z-index: -1;
		}
	}

	.account-controls {
		padding-left: 1em;
	}
}

</style>

<script setup lang="ts">
import { computed } from "vue"
import Link from "./Link.vue"
import Notifications from "./Notifications.vue"

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
				name: "consultations",
				path: "/consultations",
				icon: "chat"
			},
			{
				name: "forum",
				path: "/forum",
				icon: "forum"
			}
		]
	},
	{
		role: "user_manager",
		links: [
			{
				name: "manage",
				path: "/manage",
				icon: "group"
			},
			{
				name: "consultations",
				path: "/consultations",
				icon: "chat"
			},
			{
				name: "forum",
				path: "/forum",
				icon: "forum"
			}
		]
	},
	{
		role: "admin",
		links: [
			{
				name: "manage",
				path: "/manage",
				icon: "group"
			},
			{
				name: "forum",
				path: "/forum",
				icon: "forum"
			}
		]
	}
]


const determineRoleLinks = computed(() => {
	return linksSpecifiers.filter(specifier => specifier.role === role)[0]
})

</script>
