<template>
<div class="dropdown-filter-container">
			<label for="dropdown-filter">{{ filterLabel }}</label>
			<select name="dropdown-filter" id="dropdown-filter">
				<option v-for="filterItem in availableFilters" :value="filterItem">
					{{ filterItem }}
				</option>
			</select>
		</div>
</template>

<style scoped lang="scss">
.dropdown-filter-container {
	@apply flex justify-between;
	label {
		@apply sm:justify-self-end self-center;
	}

	select {
		@apply dark:bg-dark-300 bg-gray-300;
		position: relative;
	}
}
</style>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { deserialise } from 'kitsu-core'

import type { RawRole, RawDepartment } from '$/types/database'

import Manager from "../manager"
import RoleFetcher from "$@/communicators/role"
import DepartmentFetcher from "$@/communicators/department"

const { by } = defineProps<{
	by: string
}>()

const selectedFilter = ref("all")
const availableFilters = ref(["All"])
const filterLabel = ref(by)
const managerKind = inject("managerKind") as Manager

function siftViewableRoles() {
	// TODO: add other manager kinds
	if (managerKind.isInstituteLimited()) {
		availableFilters.value = availableFilters.value.filter((f: string) => {
			const removeAdminRoles = !f.toLowerCase().includes("admin")
			const removeServiceRoles = !f.toLowerCase().includes("service")

			return removeAdminRoles && removeServiceRoles
		})
	}

	if (managerKind.isStudentServiceLimited()) {
		availableFilters.value = availableFilters.value.filter((f: string) => {
			return f.toLowerCase().includes("service") || f.toLowerCase().includes("all")
		})
	}
}

function siftViewableDepartments() {
	// TODO: department-limited managers (Dean, Secretary, and Service Head) must only view their own departments
}

async function listRoles() {
	await RoleFetcher.list({
		filter: {
			existence: "exists"
		},
		page: {
			limit: 10,
			offset: 0
		},
		sort: ["name"]
	})
	.then(response => {
		const deserializedData = deserialise(response.body).data
		deserializedData.map((role: RawRole) => {
			availableFilters.value.push(role.name)
		})

		siftViewableRoles()
	})
}

function listDepartments() {
	DepartmentFetcher.list({
		filter: {
			existence: "exists"
		},
		page: {
			limit: 10,
			offset: 0
		},
		sort: ["name"]
	})
	.then(response => {
		const deserializedData = deserialise(response.body).data
		deserializedData.map((department: RawDepartment) => {
			availableFilters.value.push(department.fullName)
		})
	})
}

onMounted(async () => {
	switch (by) {
		case "Role":
			await listRoles()
		break

		case "Department":
			listDepartments()
		break

		case "Kind":
			// listKind()
		break
	}
})
</script>
