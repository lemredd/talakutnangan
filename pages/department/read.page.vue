<template>
	<form @submit.prevent="openConfirmation">
		<label class="block">
			Full name:
			<input
				v-model="department.data.fullName"
				class="full-name border-solid"
				type="text"/>
		</label>
		<label class="block">
			Acronym:
			<input
				v-model="department.data.acronym"
				class="acronym border-solid"
				type="text"/>
		</label>
		<label class="block">
			May admit students:
			<input
				v-model="department.data.mayAdmit"
				class="may-admit"
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

import RequestEnvironment from "$/singletons/request_environment"

import ConfirmationPassword from "@/authentication/confirmation_password.vue"
import assignPath from "$@/external/assign_path"

const pageContext = inject("pageContext") as PageContext<"deserialized", "department">
const { pageProps } = pageContext

const department = ref<DeserializedDepartmentDocument<"read">>(
	pageProps.department as DeserializedDepartmentDocument<"read">
)

const password = ref<string>(
	RequestEnvironment.isNotOnProduction
		? "password"
		: ""
)

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
		"extraUpdateDocumentProps": {
			"meta": {
				"password": password.value
			}
		}
	})
	.then(() => {
		closeConfirmation()
		password.value = ""
		assignPath(`/department/read/${department.value.data.id}`)
	})
	.catch(error => console.log(error))
}


</script>
