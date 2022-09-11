<template>
	<div class="dropdown-filter-container">
		<label for="dropdown-filter">{{ filterLabel }}</label>
		<select id="dropdown-filter" name="dropdown-filter">
			<option
				v-for="filterItem in availableFilters"
				:key="filterItem"
				:value="filterItem">
				{{ filterItem }}
			</option>
		</select>
	</div>
</template>

<style scoped lang="scss">
.dropdown-filter-container {
	@apply flex flex-col;
	margin-top:1em;
	label {
		@apply sm:justify-self-end flex-1;
	}

	select {
		@apply flex-1 dark:bg-dark-300 bg-gray-300;
		position: relative;
	}
}
@media screen and  (min-width: 640px){
	.dropdown-filter-container{
	@apply flex flex-row;
	}
}
</style>

<script setup lang="ts">
import type { DeserializedRoleListDocument } from "$/types/documents/role"
import type { DeserializedDepartmentListDocument } from "$/types/documents/department"

import { inject, onMounted, ref } from "vue"
import deserialize from "$/object/deserialize"

import Manager from "$/helpers/manager"
import RoleFetcher from "$@/fetchers/role"
import DepartmentFetcher from "$@/fetchers/department"

const { by } = defineProps<{
	by: string
}>()

const selectedFilter = ref("all")
const availableFilters = ref([ "All" ])
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
		availableFilters.value = availableFilters.value.filter((f: string) => f.toLowerCase().includes("service") || f.toLowerCase().includes("all"))
	}
}

function siftViewableDepartments() {
	// TODO: department-limited managers (Dean, Secretary, and Service Head) must only view their own departments
}

async function listRoles() {
	await new RoleFetcher().list({
		"filter": {
			"existence": "exists",
			"department": "*"
		},
		"page": {
			"limit": 10,
			"offset": 0
		},
		"sort": [ "name" ]
	})
	.then(response => {
		const { body } = response
		const deserializedData = deserialize(body) as DeserializedRoleListDocument
		deserializedData.data.map(role => {
			availableFilters.value.push(role.name)
		})

		siftViewableRoles()
	})
}

function listDepartments() {
	new DepartmentFetcher().list({
		"filter": {
			"existence": "exists"
		},
		"page": {
			"limit": 10,
			"offset": 0
		},
		"sort": [ "fullName" ]
	})
	.then(response => {
		const { body } = response
		const deserializedData = deserialize(body) as DeserializedDepartmentListDocument
		deserializedData.data.map(department => {
			availableFilters.value.push(department.acronym)
		})
	})
}

onMounted(async() => {
	switch (by) {
		case "Role":
			await listRoles()
			break

		case "Department":
			listDepartments()
			break

		case "Kind":
			// ListKind()
			break
	}
})
</script>
