<template>
	<form @submit.prevent="importData">
		<input
			type="file"
			accept="text/csv"
			name="importedCSV"/>
		<input type="submit" value="Import"/>
	</form>
</template>

<script setup lang="ts">
import { inject, ref } from "vue"

import type { PageContext } from "#/types"
import type { DeserializedRoleListDocument } from "$/types/documents/role"

const pageContext = inject("pageContext") as PageContext
const { pageProps } = pageContext
const { "roles": rawRoles } = pageProps
const roles = ref<DeserializedRoleListDocument>(rawRoles as DeserializedRoleListDocument)

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
