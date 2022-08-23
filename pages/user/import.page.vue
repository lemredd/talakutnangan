<template>
	<form @submit.prevent="importData">
		<SelectableOptionsField
			v-model="chosenRole"
			:options="roleNames"
			placeholder="Please select role to attach"/>
		<input
			type="file"
			accept="text/csv"
			name="importedCSV"/>
		<input type="submit" value="Import"/>
	</form>
</template>

<script setup lang="ts">
import { inject, ref, computed } from "vue"

import type { PageContext } from "#/types"
import type { DeserializedRoleListDocument } from "$/types/documents/role"

import SelectableOptionsField from "@/fields/selectable_options.vue"

const pageContext = inject("pageContext") as PageContext
const { pageProps } = pageContext
const { "roles": rawRoles } = pageProps
const roles = ref<DeserializedRoleListDocument>(rawRoles as DeserializedRoleListDocument)
const roleNames = computed(() => roles.value.data.map(data => data.name))
const chosenRole = ref(roleNames.value[0])

function importData(event: Event) {
	const form = event.target as HTMLFormElement
	const formData = new FormData(form)

	fetch("/api/user/import", {
		"method": "POST",
		"headers": {
			"Content-Type": "multipart/form-data"
		},
		"body": formData
	}).then(response => {
		console.log(response)
	})
}

</script>
