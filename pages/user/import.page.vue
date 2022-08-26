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
				name="meta[importedCSV]"
				accept="text/csv"/>
		</div>
		<div>
			<input
				type="hidden"
				name="data[type]"
				value="user"/>
			<input
				type="hidden"
				name="data[attributes][kind]"
				:value="chosenKind"/>
			<input
				v-for="(roleID, i) in chosenRoleIDs"
				:key="roleID"
				type="hidden"
				:name="`data[relationships][roles][data][${i}][type]`"
				value="role"/>
			<input
				v-for="(roleID, i) in chosenRoleIDs"
				:key="roleID"
				type="hidden"
				:name="`data[relationships][roles][data][${i}][id]`"
				:value="roleID"/>
			<input type="submit" value="Import"/>
		</div>
		<output v-if="createdUsers.length > 0">
			<table>
				<thead>
					<tr>
						<th v-if="isStudentResource(createdUsers[0])">Student number</th>
						<th>Name</th>
						<th>E-mail</th>
						<th>Department</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="user in createdUsers" :key="user.id">
						<td v-if="isStudentResource(user)">
							{{ user.studentDetail.data.studentNumber }}
						</td>
						<td>{{ user.name }}</td>
						<td>{{ user.email }}</td>
						<td>{{ user.department.data.acronym }}</td>
					</tr>
				</tbody>
			</table>
		</output>
	</form>
</template>

<script setup lang="ts">
import { inject, ref, computed } from "vue"

import type { PageContext } from "#/types"
import type { OptionInfo } from "$@/types/component"
import type { ErrorDocument } from "$/types/documents/base"
import type { DeserializedRoleListDocument } from "$/types/documents/role"
import type { DeserializedUserResource, DeserializedStudentResource } from "$/types/documents/user"
import { UserKindValues } from "$/types/database"

import UserFetcher from "$@/fetchers/user"
import TextTransformer from "$/helpers/text_transformers"

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
	"label": new TextTransformer().toSentenceCase(kind),
	"value": kind
}))
const chosenKind = ref<string>(kindNames[0].value)

const createdUsers = ref<DeserializedUserResource[]>([])

UserFetcher.initialize("/api")
const fetcher = new UserFetcher()

function importData(event: Event) {
	const form = event.target as HTMLFormElement
	const formData = new FormData(form)

	fetcher.import(formData).then(({ body }) => {
		const { data } = body
		createdUsers.value = data
	}).catch(({ body }) => {
		const unusedCastBody = body as ErrorDocument
		// Process the error
	})
}

function isStudentResource(resource: DeserializedUserResource)
: resource is DeserializedStudentResource {
	return resource.kind === "student"
}
</script>
