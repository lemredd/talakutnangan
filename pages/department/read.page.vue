<template>
	<form @submit.prevent="openConfirmation">
		<label class="block">
			Full name:
			<input
				id="full-name"
				v-model="department.data.fullName"
				class="border-solid"
				type="text"/>
		</label>
		<label class="block">
			Acronym:
			<input
				id="acronym"
				v-model="department.data.acronym"
				class="border-solid"
				type="text"/>
		</label>
		<label class="block">
			May admit students:
			<input
				id="may-admit"
				v-model="department.data.mayAdmit"
				type="checkbox"/>
		</label>
		<input
			type="submit"
			value="Save changes"/>
		<ConfirmationPassword
			v-model="password"
			:must-confirm="isBeingConfirmed"
			@cancel="closeConfirmation"
			@confirm="updateDepartment"/>
	</form>
</template>

<style>
</style>

<script setup lang="ts">
import { ref, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedDepartmentDocument } from "$/types/documents/department"

import Fetcher from "$@/fetchers/department"
import makeSwitch from "$@/helpers/make_switch"

import ConfirmationPassword from "@/authentication/confirmation_password.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized", "department">
const { pageProps } = pageContext

const department = ref<DeserializedDepartmentDocument<"read">>(
	pageProps.department as DeserializedDepartmentDocument<"read">
)

const password = ref<string>("")

const fetcher = new Fetcher()

const {
	"state": isBeingConfirmed,
	"on": openConfirmation,
	"off": closeConfirmation
} = makeSwitch(false)

function updateDepartment() {
	fetcher.update(department.value.data.id, {
		"acronym": department.value.data.acronym,
		"fullName": department.value.data.fullName,
		"mayAdmit": department.value.data.mayAdmit
	}, {
		"extraDataFields": {
			"meta": {
				"password": password.value
			}
		}
	}
	)
	.then(({ body, status }) => {
		closeConfirmation()
		password.value = ""
		console.log(body, status)
	})
	.catch(error => console.log(error))
}


</script>
