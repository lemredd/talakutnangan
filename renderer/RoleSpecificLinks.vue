<template>
	<div :class="`links ${role}`">
		<Link v-for="link in determineRoleLinks.links" :key="link.name" :href="link.path">
			<span class="material-icons">
				{{ link.icon }}
			</span>
		</Link>
	</div>
</template>

<style>

</style>

<script setup lang="ts">
import { computed } from "vue";
import Link from "./Link.vue"

type Props = {
	role: string
}
const props = defineProps<Props>()
const role = props.role

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
				name: "login",
				path: "/log_in",
				icon: "account_circle"
			}
		]
	},
	{
		role: "user_manager",
		links: [
			{
				name: "login",
				path: "/log_in",
				icon: "account_circle"
			}
		]
	},
]
const determineRoleLinks = computed(() => {
	return roleSpecifiers.filter(specifier => specifier.role === role)[0]
})
</script>
