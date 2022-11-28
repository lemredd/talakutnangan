<template>
	<ListRedirector resource-type="tag"/>

	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<form @submit.prevent="updateTag">
		<TextualField
			v-model="tag.data.name"
			v-model:status="nameFieldStatus"
			label="Tag name"
			class="name border-solid"
			type="text"/>
		<div class="controls">
			<Suspensible :is-loaded="hasSubmittedTag">
				<button
					v-if="mayUpdateTag"
					type="submit"
					class="update-tag-btn btn btn-primary">
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

import type { FieldStatus } from "@/fields/types"
import type { PageContext } from "$/types/renderer"
import type { TagManagementInfo } from "$@/types/independent"
import type { DeserializedTagDocument } from "$/types/documents/tag"

import Fetcher from "$@/fetchers/tag"
import makeManagementInfo from "@/tag/make_management_info"
import fillSuccessMessages from "$@/helpers/fill_success_messages"

import RequestEnvironment from "$/singletons/request_environment"

import Suspensible from "@/helpers/suspensible.vue"
import TextualField from "@/fields/non-sensitive_text.vue"
import ListRedirector from "@/helpers/list_redirector.vue"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized", "tag">
const { pageProps } = pageContext
const { userProfile } = pageProps

const tag = ref<DeserializedTagDocument>(
	{
		...pageProps.tag,
		"data": {
			...pageProps.tag.data
		}
	} as DeserializedTagDocument
)

const managementInfo = computed<TagManagementInfo>(
	() => makeManagementInfo(userProfile, tag.value.data)
)
const mayUpdateTag = computed<boolean>(() => managementInfo.value.mayUpdateTag)
const nameFieldStatus = ref<FieldStatus>(mayUpdateTag.value ? "enabled" : "disabled")
const mayArchiveTag = computed<boolean>(() => managementInfo.value.mayArchiveTag)
const mayRestoreTag = computed<boolean>(() => managementInfo.value.mayRestoreTag)

const password = ref<string>(
	RequestEnvironment.isNotOnProduction
		? "password"
		: ""
)

const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])

const fetcher = new Fetcher()

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
		const customSuccessMessage = "Tag has been successfully updated successfully!"
		fillSuccessMessages(receivedErrors, successMessages, customSuccessMessage)
	})
	.catch(response => extractAllErrorDetails(response, receivedErrors, successMessages))

	hasSubmittedTag.value = true
}

async function archiveTag() {
	await fetcher.archive([ tag.value.data.id ])
	.then(() => {
		if (!tag.value.data.deletedAt) tag.value.data.deletedAt = new Date()
		nameFieldStatus.value = "disabled"

		fillSuccessMessages(
			receivedErrors,
			successMessages,
			"Tag has been archived successfully.",
			true
		)
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
}

async function restoreTag() {
	await fetcher.restore([ tag.value.data.id ])
	.then(() => {
		if (tag.value.data.deletedAt) tag.value.data.deletedAt = null
		nameFieldStatus.value = "enabled"

		fillSuccessMessages(
			receivedErrors,
			successMessages,
			"Tag has been restored successfully.",
			true
		)
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
}
</script>
