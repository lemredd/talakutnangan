<template>
	<UserListRedirector resource-type="semester"/>

	<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
	<ReceivedSuccessMessages
		v-if="successMessages.length"
		:received-success-messages="successMessages"/>
	<form @submit.prevent="createSemester">
		<label class="block">
			Semester name:
			<input
				v-model="titleSemester"
				class="name border-solid"
				type="text"/>
			<Selectable
				v-model="semesterOrder"
				class="order"
				:options="semesterOption"/>
			<input
				v-model="startAt"
				class="start-at"
				type="date"/>
			<input
				v-model="endAt"
				class="end-at"
				type="date"/>
		</label>
		<input type="submit" value="Create semester"/>
	</form>
</template>

<style scoped lang="scss">
		.start, .end {
			@apply flex justify-between;
		}
</style>

<script setup lang="ts">
import { ref, computed } from "vue"

import type { Order } from "$/types/database"
import type { UnitError } from "$/types/server"

import SemesterFetcher from "$@/fetchers/semester"
import convertToTitle from "$/string/convert_to_title"

import type { OptionInfo } from "$@/types/component"
import Selectable from "@/fields/selectable_options.vue"

import UserListRedirector from "@/resource_management/list_redirector.vue"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"

import makeOptionInfo from "$@/helpers/make_option_info"

const name = ref<string>("")
const endAt = ref<string>("")
const startAt = ref<string>("")
const semesterOrder = ref<Order>("first")
const semesterOption = makeOptionInfo([ "first", "second", "third" ]) as OptionInfo[]
const fetcher = new SemesterFetcher()

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
		if (receivedErrors.value.length) receivedErrors.value = []
		successMessages.value.push("Semester has been created successfully!")
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
