<template>
	<UserListRedirector resource-type="tag"/>

	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<form @submit.prevent="createTag">
		<label class="block">
			Tag name:
			<input
				v-model="titleTag"
				class="name border-solid"
				type="text"/>
		</label>
		<input type="submit" value="Create tag"/>
	</form>
</template>

<style scoped lang="scss">
		.start, .end {
			@apply flex justify-between;
		}
</style>

<script setup lang="ts">
import { ref, computed } from "vue"

import TagFetcher from "$@/fetchers/tag"
import convertToTitle from "$/string/convert_to_title"

import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import UserListRedirector from "@/resource_management/list_redirector.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

const name = ref<string>("")
const fetcher = new TagFetcher()

const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])

const titleTag = computed<string>({
	"get": () => name.value,
	set(newValue: string): void {
		name.value = convertToTitle(newValue)
	}
})

function createTag() {
	fetcher.create({
		"deletedAt": null,
		"name": name.value
	})
	.then(() => {
		if (receivedErrors.value.length) receivedErrors.value = []
		successMessages.value.push("Tag has been created successfully!")
	})
	.catch(response => extractAllErrorDetails(response, receivedErrors, successMessages))
}
</script>
