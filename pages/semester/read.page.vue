<template>
	<ListRedirector resource-type="semester"/>

	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<form @submit.prevent="updateSemester">
		<TextualField
			v-model="semester.data.name"
			v-model:status="nameFieldStatus"
			class="name field"
			label="Semester name: "
			type="text"/>
		<Selectable
			v-model="semester.data.semesterOrder"
			class="order field"
			label="Order: "
			:options="semesterOption"
			:disabled="!mayUpdateSemester"/>
		<DateSelect
			v-model="semester.data.startAt"
			label="Starts at: "
			class="start-at field"
			:disabled="!mayUpdateSemester"/>
		<DateSelect
			v-model="semester.data.endAt"
			label="Ends at: "
			class="end-at field"
			:disabled="!mayUpdateSemester"/>
		<Suspensible :is-loaded="hasSubmittedSemester">
			<div class="controls">
				<button
					v-if="mayUpdateSemester"
					type="submit"
					class="update-user-btn btn btn-primary">
					update semester
				</button>
				<button
					v-if="mayRestoreSemester"
					type="button"
					class="btn btn-primary"
					@click="restoreSemester">
					Restore
				</button>
				<button
					v-if="mayArchiveSemester"
					type="button"
					class="btn btn-primary"
					@click="archiveSemester">
					Archive
				</button>
			</div>
		</Suspensible>
	</form>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";

	.controls{
		@apply mt-8;
		@apply flex justify-between;
	}

	.field {
		@apply my-4;
	}
</style>

<script setup lang="ts">
import { ref, inject, computed } from "vue"

import type { FieldStatus } from "@/fields/types"
import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { SemesterManagementInfo } from "$@/types/independent"
import type { DeserializedSemesterDocument } from "$/types/documents/semester"

import Fetcher from "$@/fetchers/semester"
import makeOptionInfo from "$@/helpers/make_option_info"
import makeManagementInfo from "@/semester/make_management_info"
import RequestEnvironment from "$/singletons/request_environment"
import fillSuccessMessages from "$@/helpers/fill_success_messages"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"

import DateSelect from "@/fields/date_selector.vue"
import Suspensible from "@/helpers/suspensible.vue"
import Selectable from "@/fields/selectable_options.vue"
import ListRedirector from "@/helpers/list_redirector.vue"
import TextualField from "@/fields/non-sensitive_text_capital.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"


const pageContext = inject("pageContext") as PageContext<"deserialized", "semester">
const { pageProps } = pageContext
const { userProfile } = pageProps

const semesterOption = makeOptionInfo([ "first", "second", "third" ]) as OptionInfo[]

const semester = ref<DeserializedSemesterDocument>(
	{
		...pageProps.semester,
		"data": {
			...pageProps.semester.data
		}
	} as DeserializedSemesterDocument
)

const managementInfo = computed<SemesterManagementInfo>(
	() => makeManagementInfo(userProfile, semester.value.data)
)

const mayUpdateSemester = computed<boolean>(() => managementInfo.value.mayUpdateSemester)
const mayArchiveSemester = computed<boolean>(() => managementInfo.value.mayArchiveSemester)
const mayRestoreSemester = computed<boolean>(() => managementInfo.value.mayRestoreSemester)

const nameFieldStatus = computed<FieldStatus>(() => {
	const status = mayUpdateSemester.value ? "enabled" : "disabled"
	return status
})

const password = ref<string>(
	RequestEnvironment.isNotOnProduction
		? "password"
		: ""
)

const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])

const fetcher = new Fetcher()

const hasSubmittedSemester = ref<boolean>(true)

async function updateSemester() {
	hasSubmittedSemester.value = false
	await fetcher.update(semester.value.data.id, {
		"deletedAt": null,
		"endAt": semester.value.data.endAt.toJSON(),
		"name": semester.value.data.name,
		"semesterOrder": semester.value.data.semesterOrder,
		"startAt": semester.value.data.startAt.toJSON()
	}, {
		"extraUpdateDocumentProps": {
			"meta": {
				"password": password.value
			}
		}
	})
	.then(() => {
		fillSuccessMessages(receivedErrors, successMessages)
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
	hasSubmittedSemester.value = true
}

async function archiveSemester() {
	hasSubmittedSemester.value = false

	await fetcher.archive([ semester.value.data.id ])
	.then(() => {
		if (!semester.value.data.deletedAt) semester.value.data.deletedAt = new Date()

		fillSuccessMessages(receivedErrors, successMessages)
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))

	hasSubmittedSemester.value = true
}

async function restoreSemester() {
	hasSubmittedSemester.value = false

	await fetcher.restore([ semester.value.data.id ])
	.then(() => {
		if (semester.value.data.deletedAt) semester.value.data.deletedAt = null

		fillSuccessMessages(receivedErrors, successMessages)
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))

	hasSubmittedSemester.value = true
}
</script>
