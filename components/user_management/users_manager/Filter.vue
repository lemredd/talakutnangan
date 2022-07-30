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
import type { ManagerKind } from '../types'

import RoleFetcher from "$@/communicators/role"
import DepartmentFetcher from "$@/communicators/department"

const { by } = defineProps<{
	by: string
}>()

const selectedFilter = ref("all")
const availableFilters = ref(["all"])
const filterLabel = ref(by)
const managerKind = inject("managerKind") as ManagerKind

function siftViewableRoles() {
	// TODO: add other manager kinds
	if (managerKind === "dean") {
		availableFilters.value = availableFilters.value.filter((f) => {
			const removeAdminRoles = !f.toLowerCase().includes("admin")
			const removeServiceRoles = !f.toLowerCase().includes("service")

			return removeAdminRoles && removeServiceRoles
		})
	}
}

function siftViewableDepartments() {
	// TODO: department-limited managers (Dean, Secretary, and Service Head) must only view their own departments
}

function listRoles() {
	RoleFetcher.list({
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

onMounted(() => {
	switch (by) {
		case "Role":
			listRoles()
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
