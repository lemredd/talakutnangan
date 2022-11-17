<template>
	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<form @submit.prevent="openConfirmation">
		<TextualField
			v-model="semester.data.name"
			class="name field"
			label="Semester name: "
			type="text"/>
		<Selectable
			v-model="semester.data.semesterOrder"
			class="order"
			:options="semesterOption"/>
		<DateSelect
			v-model="semester.data.startAt"
			class="start-at border-solid"/>
		<DateSelect
			v-model="semester.data.endAt"
			class="end-at border-solid"/>
		<div class="controls">
			<Suspensible :is-loaded="hasSubmittedSemester">
				<button type="submit" class="update-user-btn btn btn-primary">
					update semester
				</button>
			</Suspensible>
			<button
				v-if="mayRestoreSemester && mayUpdateSemester"
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

		<ConfirmationPassword
			v-model="password"
			:must-confirm="isBeingConfirmed"
			@cancel="closeConfirmation"
			@confirm="updateSemester"/>
	</form>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";

	.controls{
		@apply flex justify-between;
	}
</style>

<script setup lang="ts">
import { ref, inject, computed } from "vue"

import type { PageContext } from "$/types/renderer"
import type { SemesterManagementInfo } from "$@/types/independent"
import type { DeserializedSemesterDocument } from "$/types/documents/semester"

import Fetcher from "$@/fetchers/semester"
import makeSwitch from "$@/helpers/make_switch"
import type { OptionInfo } from "$@/types/component"
import makeManagementInfo from "@/semester/make_management_info"
import RequestEnvironment from "$/singletons/request_environment"
import fillSuccessMessages from "$@/helpers/fill_success_messages"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"

import DateSelect from "@/fields/date_selector.vue"
import Suspensible from "@/helpers/suspensible.vue"
import Selectable from "@/fields/selectable_options.vue"
import TextualField from "@/fields/non-sensitive_text_capital.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ConfirmationPassword from "@/authentication/confirmation_password.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

import makeOptionInfo from "$@/helpers/make_option_info"

const pageContext = inject("pageContext") as PageContext<"deserialized", "semester">
const { pageProps } = pageContext
const { userProfile } = pageProps

const semesterOption = makeOptionInfo([ "first", "second", "third" ]) as OptionInfo[]

const semester = ref<DeserializedSemesterDocument<"read">>(
	pageProps.semester as DeserializedSemesterDocument<"read">
)
const isDeleted = computed<boolean>(() => Boolean(semester.value.data.deletedAt))

const semesters = ref<DeserializedSemesterDocument>(
	{
		...pageProps.semester,
		"data": {
			...pageProps.semester.data
		}
	} as DeserializedSemesterDocument
)

const managementInfo = computed<SemesterManagementInfo>(
	() => makeManagementInfo(userProfile, semesters.value.data)
)

const mayUpdateSemester = computed<boolean>(() => managementInfo.value.mayUpdateSemester)

const mayArchiveOrRestoreSemester = computed<boolean>(
	() => managementInfo.value.mayArchiveSemester && managementInfo.value.mayRestoreSemester)

const mayArchiveSemester = computed<boolean>(
	() => !isDeleted.value && mayArchiveOrRestoreSemester.value
)
const mayRestoreSemester = computed<boolean>(
	() => isDeleted.value && mayArchiveOrRestoreSemester.value
)

const password = ref<string>(
	RequestEnvironment.isNotOnProduction
		? "password"
		: ""
)

const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])

const fetcher = new Fetcher()

const {
	"state": isBeingConfirmed,
	"on": openConfirmation,
	"off": closeConfirmation
} = makeSwitch(false)

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
		closeConfirmation()
		password.value = ""

		fillSuccessMessages(receivedErrors, successMessages)
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
	hasSubmittedSemester.value = true
}

async function archiveSemester() {
	await fetcher.archive([ semester.value.data.id ])
	.then(() => fillSuccessMessages(receivedErrors, successMessages))
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
}

async function restoreSemester() {
	await fetcher.restore([ semester.value.data.id ])
	.then(() => fillSuccessMessages(receivedErrors, successMessages))
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
}
</script>
