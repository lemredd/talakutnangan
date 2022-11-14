<template>
	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<form @submit.prevent="openConfirmation">
		<input
			v-model="semester.data.name"
			class="name border-solid"
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
import type { DeserializedSemesterDocument } from "$/types/documents/semester"

import Fetcher from "$@/fetchers/semester"
import makeSwitch from "$@/helpers/make_switch"
import type { OptionInfo } from "$@/types/component"

import RequestEnvironment from "$/singletons/request_environment"
import { semester as permissionGroup } from "$/permissions/permission_list"
import { ARCHIVE_AND_RESTORE } from "$/permissions/semester_combinations"

import DateSelect from "@/fields/date_selector.vue"
import Selectable from "@/fields/selectable_options.vue"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
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

const mayArchiveOrRestoreSemester = computed<boolean>(() => {
	const roles = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [
		ARCHIVE_AND_RESTORE
	])

	return isPermitted
})

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

function updateSemester() {
	hasSubmittedSemester.value = false
	fetcher.update(semester.value.data.id, {
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
		if (receivedErrors.value.length) receivedErrors.value = []
		successMessages.value.push("Semester has been read successfully!")
	})
	.catch(response => extractAllErrorDetails(response, receivedErrors, successMessages))
}

async function archiveSemester() {
	await fetcher.archive([ semester.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}

async function restoreSemester() {
	await fetcher.restore([ semester.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}
</script>
