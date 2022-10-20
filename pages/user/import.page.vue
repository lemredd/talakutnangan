<template>
	<AdminConfigHeader
		class="tabs"
		title="Admin Configuration"
		:tab-infos="TabInfos"/>
	<ul v-if="receivedErrors.length" class="error">
		<h3>The following errors have occured:</h3>
		<li
			v-for="error in receivedErrors"
			:key="receivedErrors.indexOf(error)">
			{{ error }}
		</li>
	</ul>
	<form @submit.prevent="importData">
		<div>
			<MultiSelectableOptionsField
				v-model="chosenRoleIDs"
				class="role"
				label="Add the roles to attach"
				:options="roleNames"/>
			<SelectableOptionsField
				v-model="chosenKind"
				class="kind"
				label="What kind of users to import?"
				:options="kindNames"/>
		</div>
		<div>
			<label class="btn" for="choose-file-btn">
				<input
					id="choose-file-btn"
					type="file"
					name="meta[importedCSV]"
					accept="text/csv"/>
				CHOOSE FILE
			</label>
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

			<input
				id="import-btn"
				class="btn btn-primary"
				type="submit"
				value="Import"/>
		</div>
		<output v-if="createdUsers.length > 0">
			<OutputTable>
				<template #table-headers>
					<tr>
						<th v-if="isStudentResource(createdUsers[0])" class="">Student number</th>
						<th>Name</th>
						<th>E-mail</th>
						<th>Department</th>
					</tr>
				</template>
				<template #table-body>
					<tr
						v-for="user in createdUsers"
						:key="user.id">
						<td v-if="isStudentResource(user)">
							{{ user.studentDetail.data.studentNumber }}
						</td>
						<td>{{ user.name }}</td>
						<td>{{ user.email }}</td>
						<td>{{ user.department.data.acronym }}</td>
					</tr>
				</template>
			</OutputTable>
		</output>
	</form>
</template>
<style scoped lang = "scss">
@import "@styles/btn.scss";
@import "@styles/error.scss";

.tabs {
	margin-bottom: 2em;
}

.kind{
	@apply flex-col;
	margin-bottom: 3em;
}

#choose-file-btn {
	display:none;
	appearance: none;
}
#import-btn{
	margin-top:1em;
}


@media (min-width: 640px) {
	.kind{
		@apply flex flex-row;
	}
}

</style>


<script setup lang="ts">
import { inject, ref, computed } from "vue"

import type { UnitError } from "$/types/server"
import { UserKindValues } from "$/types/database"
import type { OptionInfo } from "$@/types/component"
import type { PageContext, PageProps } from "$/types/renderer"
import type { DeserializedRoleListDocument } from "$/types/documents/role"
import type { DeserializedUserResource, DeserializedStudentResource } from "$/types/documents/user"

import UserFetcher from "$@/fetchers/user"
import convertForSentence from "$/string/convert_for_sentence"

import AdminConfigHeader from "@/helpers/tabbed_page_header.vue"
import OutputTable from "@/helpers/overflowing_table.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import MultiSelectableOptionsField from "@/fields/multi-selectable_options.vue"

import TabInfos from "@/resource_management/resource_tab_infos"

const pageContext = inject("pageContext") as PageContext
const { pageProps } = pageContext

const { "roles": rawRoles } = pageProps as PageProps<"serialized", "roles">
const roles = ref<DeserializedRoleListDocument>(rawRoles as DeserializedRoleListDocument)
const roleNames = computed<OptionInfo[]>(() => roles.value.data.map(data => ({
	"label": data.name,
	"value": data.id
})))
const chosenRoleIDs = ref<string[]>([])

const kindNames = UserKindValues.map(kind => ({
	"label": convertForSentence(kind),
	"value": kind
}))
const chosenKind = ref<string>(kindNames[0].value)

const createdUsers = ref<DeserializedUserResource<"roles"|"department">[]>([])
const receivedErrors = ref<string[]>([])

const fetcher = new UserFetcher()

function importData(event: Event) {
	const form = event.target as HTMLFormElement
	const formData = new FormData(form)

	fetcher.import(formData).then(({ body }) => {
		const { data } = body
		createdUsers.value = data as DeserializedUserResource<"roles"|"department">[]
	})
	.catch(({ body }) => {
		if (body) {
			const { errors } = body
			receivedErrors.value = errors.map((error: UnitError) => {
				const readableDetail = error.detail
				// TODO(others): Generalize replacing substring using regex
				.replace(
					/^(The |Field )/u,
					""
				)
				.replace(
					/( in field )?"meta\.importedCSV\.\d+\.(email|name|studentNumber)?"/u,
					" is a $2"
				)
				.replace(
					/^ is a studentNumber/u,
					"Student number"
				)
				.replace(
					/must match ".+?"/u,
					" must be valid"
				)
				.replace(
					/ does exists in the database"/u,
					" that already exists"
				)

				return readableDetail
			})
		} else {
			receivedErrors.value = [ "an error occured" ]
		}
	})
}

function isStudentResource(resource: DeserializedUserResource)
: resource is DeserializedStudentResource {
	return resource.kind === "student"
}
</script>
