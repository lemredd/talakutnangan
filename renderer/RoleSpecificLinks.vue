<template>
	<div :class="`links ${role}`">
		<Link v-for="link in determineRoleLinks.links" :key="link.name" :href="link.path">
			<span class="material-icons">
				{{ link.icon }}
			</span>
		</Link>
		<Notifications></Notifications>

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

	a, .account-controls a {
		height: 30px;
		padding: 3px 10px;
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
const roleSpecifiers = [
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
]
const determineRoleLinks = computed(() => {
	return roleSpecifiers.filter(specifier => specifier.role === role)[0]
})
</script>
