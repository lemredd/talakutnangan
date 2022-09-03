<template>
	<ResourceConfigHeader :title="determineTitle"/>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import { computed, inject } from "vue"

import type { DeserializedUserProfile } from "$/types/documents/user"

import Manager from "$/helpers/manager"
import type { PageContext } from "$/types/renderer"
import ResourceConfigHeader from "@/tabbed_page_header.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized", "consultations">
const { pageProps } = pageContext
const userProfile = pageProps.userProfile as DeserializedUserProfile
const currentManager = new Manager(userProfile)
const currentUserDepartment = userProfile.data.department.data.id

const determineTitle = computed(() => {
	if (currentManager.isInstituteLimited()) return `Users of ${currentUserDepartment}`
	if (currentManager.isStudentServiceLimited()) return `Employees of ${currentUserDepartment}`
	return "Administrator Configuration"
})
</script>
