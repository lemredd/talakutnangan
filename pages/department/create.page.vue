<template>
	<ListRedirector resource-type="department"/>

	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<form @submit.prevent="createDepartment">
		<NonSensitiveText
			id="full-name"
			v-model="titleDepartment"
			label="Full Name"
			class="field"
			type="text"/>

		<NonSensitiveText
			id="acronym"
			v-model="capitalAcronym"
			label="Acronym"
			class="field"
			type="text"/>

		<label for="may-admit" class="field">
			<input
				id="may-admit"
				v-model="mayAdmit"
				type="checkbox"/>
			May admit students
		</label>

		<input
			type="submit"
			class="btn btn-primary"
			value="Create department"/>
	</form>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";

	.field {
		@apply my-4;

		display: block;
	}
</style>

<script setup lang="ts">
import { ref, computed } from "vue"

import convertToTitle from "$/string/convert_to_title"
import DepartmentFetcher from "$@/fetchers/department"
import fillSuccessMessages from "$@/helpers/fill_success_messages"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"

import ListRedirector from "@/helpers/list_redirector.vue"
import NonSensitiveText from "@/fields/non-sensitive_text.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

const fullName = ref("")
const acronym = ref("")
const mayAdmit = ref(false)

const fetcher = new DepartmentFetcher()
const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])

const titleDepartment = computed<string>({
	"get": () => fullName.value,
	set(newValue: string): void {
		fullName.value = convertToTitle(newValue)
	}
})

const capitalAcronym = computed<string>({
	"get": () => acronym.value,
	set(newValue: string): void {
		acronym.value = newValue.toUpperCase()
	}
})

function createDepartment() {
	fetcher.create({
		"acronym": acronym.value,
		"fullName": fullName.value,
		"mayAdmit": mayAdmit.value
	})
	.then(() => {
		fullName.value = ""
		acronym.value = ""
		mayAdmit.value = false
		fillSuccessMessages(receivedErrors, successMessages)
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
}
</script>
