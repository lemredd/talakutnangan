<template>
	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<form @submit.prevent="openConfirmation">
		<input
			v-model="tag.data.name"
			class="name border-solid"
			type="text"/>
		<div class="controls">
			<input
				type="submit"
				value="Save changes"
				class="btn btn-primary"/>
			<button
				v-if="mayRestoreTag"
				type="button"
				class="btn btn-primary"
				@click="restoreTag">
				Restore
			</button>
			<button
				v-if="mayArchiveTag"
				type="button"
				class="btn btn-primary"
				@click="archiveTag">
				Archive
			</button>
		</div>

		<ConfirmationPassword
			v-model="password"
			:must-confirm="isBeingConfirmed"
			@cancel="closeConfirmation"
			@confirm="updateTag"/>
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
import type { DeserializedTagDocument } from "$/types/documents/tag"

import Fetcher from "$@/fetchers/tag"
import makeSwitch from "$@/helpers/make_switch"

import RequestEnvironment from "$/singletons/request_environment"
import { tag as permissionGroup } from "$/permissions/permission_list"
import { ARCHIVE_AND_RESTORE } from "$/permissions/tag_combinations"

import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ConfirmationPassword from "@/authentication/confirmation_password.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized", "tag">
const { pageProps } = pageContext
const { userProfile } = pageProps

const tag = ref<DeserializedTagDocument<"read">>(
	pageProps.tag as DeserializedTagDocument<"read">
)
const isDeleted = computed<boolean>(() => Boolean(tag.value.data.deletedAt))

const mayArchiveOrRestoreTag = computed<boolean>(() => {
	const roles = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, [
		ARCHIVE_AND_RESTORE
	])

	return isPermitted
})

const mayArchiveTag = computed<boolean>(
	() => !isDeleted.value && mayArchiveOrRestoreTag.value
)
const mayRestoreTag = computed<boolean>(
	() => isDeleted.value && mayArchiveOrRestoreTag.value
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

function updateTag() {
	fetcher.update(tag.value.data.id, {
		"deletedAt": null,
		"name": tag.value.data.name
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
		successMessages.value.push("Tag has been read successfully!")
	})
	.catch(response => extractAllErrorDetails(response, receivedErrors, successMessages))
}

async function archiveTag() {
	await fetcher.archive([ tag.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}

async function restoreTag() {
	await fetcher.restore([ tag.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}
</script>
