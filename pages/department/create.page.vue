<template>
	<UserListRedirector resource-type="department"/>

	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<form @submit.prevent="createDepartment">
		<label class="block">
			Full name:
			<input
				id="full-name"
				v-model="titleDepartment"
				class="border-solid"
				type="text"/>
		</label>
		<label class="block">
			Acronym:
			<input
				id="acronym"
				v-model="capitalAcronym"
				class="border-solid"
				type="text"/>
		</label>
		<label class="block">
			May admit students:
			<input
				id="may-admit"
				v-model="mayAdmit"
				type="checkbox"/>
		</label>
		<input type="submit" value="Create department"/>
	</form>
</template>

<style>
</style>

<script setup lang="ts">
import { ref, computed } from "vue"

import convertToTitle from "$/string/convert_to_title"
import DepartmentFetcher from "$@/fetchers/department"

import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import UserListRedirector from "@/resource_management/list_redirector.vue"
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
		if (receivedErrors.value.length) receivedErrors.value = []
		successMessages.value.push("Department has been created successfully!")
	})
	.catch(response => extractAllErrorDetails(response, receivedErrors, successMessages))
}
</script>
