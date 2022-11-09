<template>
	<ListRedirector resource-type="tag"/>

	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<form @submit.prevent="createTag">
		<Suspensible :is-loaded="isCurrentlyNotSubmitting">
			<NonSensitiveText
				v-model="name"
				label="Tag name:"
				status="enabled"
				class="border-solid"
				type="text"/>
		</Suspensible>
		<input type="submit" value="Create tag"/>
	</form>
</template>

<style>
</style>

<script setup lang="ts">
import { ref } from "vue"

import type { UnitError } from "$/types/server"

import Fetcher from "$@/fetchers/tag"

import Suspensible from "@/helpers/suspensible.vue"
import NonSensitiveText from "@/fields/non-sensitive_text.vue"
import ListRedirector from "@/resource_management/list_redirector.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

const name = ref("")
const fetcher = new Fetcher()
const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])
const isCurrentlyNotSubmitting = ref<boolean>(true)

async function createTag() {
	isCurrentlyNotSubmitting.value = false
	await fetcher.create({
		"deletedAt": null,
		"name": name.value
	})
	.then(() => {
		name.value = ""
		if (receivedErrors.value.length) receivedErrors.value = []
		successMessages.value.push("Tag has been created successfully!")
	})
	.catch(({ body }) => {
		if (successMessages.value.length) successMessages.value = []
		if (body) {
			const { errors } = body
			receivedErrors.value = errors.map((error: UnitError) => {
				const readableDetail = error.detail

				return readableDetail
			})
		} else {
			receivedErrors.value = [ "an error occured" ]
		}
	})
	isCurrentlyNotSubmitting.value = true
}
</script>
