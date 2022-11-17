<template>
	<ListRedirector resource-type="semester"/>

	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<form @submit.prevent="createSemester">
		<label class="block">
			Semester name:
			<TextualField
				v-model="titleSemester"
				class="mb-10"
				type="text"/>
			<Selectable
				v-model="semesterOrder"
				label="Order: "
				class="order mb-10"
				:options="semesterOption"/>
			Start:
			<input
				v-model="startAt"
				class="start date"
				label="Start: "
				type="date"/>
			End:
			<input
				v-model="endAt"
				class="end date"
				type="date"/>
		</label>
		<button
			class="btn btn-primary"
			type="submit">
			Create Semester
		</button>
	</form>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";
	.start, .end {
		@apply flex flex-row;
		@apply m-10 ;
	}
	.date {
			@apply p-2 bg-gray-300 shadow-inner rounded-0.5rem ml-5;
		}

</style>

<script setup lang="ts">
import { ref, computed } from "vue"

import type { Order } from "$/types/database"
import type { OptionInfo } from "$@/types/component"

import SemesterFetcher from "$@/fetchers/semester"
import convertToTitle from "$/string/convert_to_title"
import fillSuccessMessages from "$@/helpers/fill_success_messages"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"

import Selectable from "@/fields/selectable_options.vue"
import ListRedirector from "@/helpers/list_redirector.vue"
import TextualField from "@/fields/non-sensitive_text_capital.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

import makeOptionInfo from "$@/helpers/make_option_info"

const name = ref<string>("")
const semesterOrder = ref<Order>("first")
const semesterOption = makeOptionInfo([ "first", "second", "third" ]) as OptionInfo[]
const fetcher = new SemesterFetcher()
const endAt = ref<string>("")
const startAt = ref<string>("")
const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])

const titleSemester = computed<string>({
	"get": () => name.value,
	set(newValue: string): void {
		name.value = convertToTitle(newValue)
	}
})

function createSemester() {
	fetcher.create({
		"deletedAt": null,
		"endAt": new Date(endAt.value).toJSON(),
		"name": name.value,
		"semesterOrder": semesterOrder.value,
		"startAt": new Date(startAt.value).toJSON()
	})
	.then(() => {
		name.value = ""
		endAt.value = ""
		startAt.value = ""
		semesterOrder.value = "first"
		fillSuccessMessages(receivedErrors, successMessages)
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
}
</script>
