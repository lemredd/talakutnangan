<template>
	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<form @submit.prevent="openConfirmation">
		<TextualField
			v-model="tag.data.name"
			label="Tag name"
			class="name border-solid"
			type="text"/>
		<div class="controls">
			<Suspensible :is-loaded="hasSubmittedTag">
				<button type="submit" class="update-tag-btn btn btn-primary">
					update tag
				</button>
			</Suspensible>
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
		@apply mt-8;
		@apply flex justify-between;
	}
</style>

<script setup lang="ts">
import { ref, inject, computed } from "vue"

import type { PageContext } from "$/types/renderer"
import type { TagManagementInfo } from "$@/types/independent"
import type { DeserializedTagDocument } from "$/types/documents/tag"

import Fetcher from "$@/fetchers/tag"
import makeSwitch from "$@/helpers/make_switch"
import makeManagementInfo from "@/tag/make_management_info"

import RequestEnvironment from "$/singletons/request_environment"

import TextualField from "@/fields/non-sensitive_text.vue"
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
const tags = ref<DeserializedTagDocument>(
	{
		...pageProps.tag,
		"data": {
			...pageProps.tag.data
		}
	} as DeserializedTagDocument
)

const managementInfo = computed<TagManagementInfo>(
	() => makeManagementInfo(userProfile, tags.value.data)
)

const mayArchiveTag = computed<boolean>(
	() => managementInfo.value.mayArchiveTag)

const mayRestoreTag = computed<boolean>(
	() => managementInfo.value.mayRestoreTag)

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

const hasSubmittedTag = ref<boolean>(true)

function updateTag() {
	hasSubmittedTag.value = false
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
