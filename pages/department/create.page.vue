<template>
	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
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

import ReceivedErrors from "@/helpers/received_errors.vue"

const fullName = ref("")
const acronym = ref("")
const mayAdmit = ref(false)

const fetcher = new DepartmentFetcher()
const receivedErrors = ref<string[]>([])
function createDepartment() {
	fetcher.create({
		"acronym": acronym.value,
		"fullName": fullName.value,
		"mayAdmit": mayAdmit.value
	})
	.then(({ body, status }) => {
		// output success message
	})
	.catch(({ body }) => {
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
