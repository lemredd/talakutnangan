<template>
	<div :class="`links ${role}`">
		<Notifications v-if="!isRoleGuest"></Notifications>

		<div v-if="!isRoleGuest" class="account-controls">
			<a role="button" class="material-icons">account_circle</a>
			<span class="material-icons">expand_more</span>
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
