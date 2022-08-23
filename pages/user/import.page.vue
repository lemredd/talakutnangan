<template>
	<form @submit.prevent="importData">
		<MultiSelectableOptionsField
			v-model="chosenRoleIDs"
			label="Add the roles to attach"
			:options="roleNames"/>
		<SelectableOptionsField
			v-model="chosenKind"
			label="What kind of users to import?"
			:options="kindNames"/>
		<div>
			<input
				type="file"
				accept="text/csv"
				name="importedCSV"/>
		</div>
		<div>
			<input type="submit" value="Import"/>
		</div>
	</form>
</template>

<script setup lang="ts">
import { inject, ref, computed } from "vue"

import type { PageContext } from "#/types"
import type { OptionInfo } from "$@/types/component"
import type { DeserializedRoleListDocument } from "$/types/documents/role"
import { UserKindValues } from "$/types/database"

import convertToSentenceCase from "$/helpers/convert_to_sentence_case"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import MultiSelectableOptionsField from "@/fields/multi-selectable_options.vue"

const pageContext = inject("pageContext") as PageContext
const { pageProps } = pageContext
const { "roles": rawRoles } = pageProps
const roles = ref<DeserializedRoleListDocument>(rawRoles as DeserializedRoleListDocument)
const roleNames = computed<OptionInfo[]>(() => roles.value.data.map(data => ({
	"label": data.name,
	"value": data.id
})))
const chosenRoleIDs = ref<string[]>([])

const kindNames = UserKindValues.map(kind => ({
	"label": convertToSentenceCase(kind),
	"value": kind
}))
const chosenKind = ref<string>(kindNames[0].value)

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
