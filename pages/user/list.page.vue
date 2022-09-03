<template>
	<AdminConfigHeader v-if="currentResourceManager.isAdmin()" :title="determineTitle"/>
	<h1 v-else class="resource-config-header">
		{{ determineTitle }}
	</h1>
</template>

<style scoped lang="scss">
.resource-config-header {
	font-size: 1.75em;
	text-transform: uppercase;
}
</style>

<script setup lang="ts">
import { computed, inject } from "vue"

import type { DeserializedUserProfile } from "$/types/documents/user"

import Manager from "$/helpers/manager"
import type { PageContext } from "$/types/renderer"
import AdminConfigHeader from "@/tabbed_page_header.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized", "consultations">
const { pageProps } = pageContext
const userProfile = pageProps.userProfile as DeserializedUserProfile
const currentResourceManager = new Manager(userProfile)
const currentUserDepartment = userProfile.data.department.data.fullName

const determineTitle = computed(() => {
	console.log(currentResourceManager.isInstituteLimited())

	if (currentResourceManager.isInstituteLimited()) {
		return `Users of ${currentUserDepartment}`
	}
	if (currentResourceManager.isStudentServiceLimited()) {
		return `Employees of ${currentUserDepartment}`
	}

	return "Administrator Configuration"
})
</script>
