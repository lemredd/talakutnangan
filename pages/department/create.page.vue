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
				v-model="fullName"
				class="border-solid"
				type="text"/>
		</label>
		<label class="block">
			Acronym:
			<input
				id="acronym"
				v-model="acronym"
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
import { ref } from "vue"

import type { UnitError } from "$/types/server"

import DepartmentFetcher from "$@/fetchers/department"

import UserListRedirector from "@/resource_management/list_redirector.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

const fullName = ref("")
const acronym = ref("")
const mayAdmit = ref(false)

const fetcher = new DepartmentFetcher()
const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])

function createDepartment() {
	fetcher.create({
		"acronym": acronym.value,
		"fullName": fullName.value,
		"mayAdmit": mayAdmit.value
	})
	.then(({ body, status }) => {
		if (receivedErrors.value.length) receivedErrors.value = []
		successMessages.value.push("Department has been create successfully!")
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
}
</script>
