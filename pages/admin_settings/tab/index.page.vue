<template>
	<header>
		<h1>administrative settings</h1>
	</header>

	<main>
		<Tab :tabs="tabs" />
	</main>
</template>

<style scoped lang="scss">
header {
	margin: 1em 0;
	h1 {
		font-size: 2em;
		font-weight: 700;
		text-align: center;
		text-transform: uppercase;
	}
}
</style>

<script setup lang="ts">
import Tab from "@/Tab.vue"
import Users from "@/admin_settings/Users.vue"
import Roles from "@/admin_settings/Roles.vue"
import Departments from "@/admin_settings/Departments.vue"
import { usePageContext } from "#/usePageContext"
import { provide } from "vue"

const tabs = {
	users: Users,
	roles: Roles,
	departments: Departments
}

provide("url", usePageContext().routeParams!.tab)
</script>
