<template>
	<form @submit.prevent="updateAndReload">
		<div class="user-name">
			<NonSensitiveTextField
				v-model="user.data.name"
				v-model:status="nameFieldStatus"
				label="User Name"
				type="text"/>
		</div>

		<div class="roles">
			<MultiSelectableOptionsField
				v-model="userRoleIDs"
				class="selectable-roles"
				label="Roles"
				:options="selectableRoles"/>
		</div>

		<div class="department">
			<SelectableOptionsField
				v-model="userDepartment"
				class="selectable-department"
				label="Department"
				:options="selectableDepartments"/>
		</div>

		<div class="controls flex justify-between">
			<button type="submit" class="btn btn-primary">
				Submit
			</button>
			<button
				v-if="isDeleted"
				type="button"
				class="btn btn-primary"
				@click="restoreUser">
				Restore
			</button>
			<button
				v-else
				type="button"
				class="btn btn-primary"
				@click="archiveUser">
				Archive
			</button>
		</div>
	</form>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import {
	ref,
	inject,
	computed,
	onMounted
} from "vue"

import type { FieldStatus } from "@/fields/types"
import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type {
	DeserializedRoleResource
} from "$/types/documents/role"

import Fetcher from "$@/fetchers/user"
import assignPath from "$@/external/assign_path"

import NonSensitiveTextField from "@/fields/non-sensitive_text.vue"
import SelectableOptionsField from "@/fields/selectable_options.vue"
import MultiSelectableOptionsField from "@/fields/multi-selectable_options.vue"

type RequiredExtraProps = "user" | "roles" | "departments"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const user = ref(pageProps.user)

const { roles } = pageProps
const userRoleIDs = ref(
	user.value.data.roles?.data.map(role => role.id) as string[]
)
const selectableRoles = roles.data.map(
	(role: DeserializedRoleResource) => ({
		"label": role.name,
		"value": role.id
	})
) as OptionInfo[]
const isDeleted = computed<boolean>(() => Boolean(user.value.deletedAt))

const nameFieldStatus = ref<FieldStatus>("locked")

const { departments } = pageProps
const userDepartment = ref(user.value.data.department?.data.id as string)
const selectableDepartments = departments.data.map(department => ({
	"label": department.fullName,
	"value": department.id
}))

let fetcher = new Fetcher()


async function updateUser() {
	await fetcher.update(user.value.data.id, {
		"email": user.value.data.email,
		"kind": user.value.data.kind,
		"name": user.value.data.name,
		"prefersDark": user.value.data.prefersDark ? user.value.data.prefersDark : false
	})
	await new Promise(resolve => {
		setTimeout(resolve, 1000)
	})
	await fetcher.updateAttachedRole(user.value.data.id, userRoleIDs.value)
	await new Promise(resolve => {
		setTimeout(resolve, 1000)
	})
	await fetcher.updateDepartment(user.value.data.id, userDepartment.value)
	await new Promise(resolve => {
		setTimeout(resolve, 1000)
	})
}

function updateAndReload() {
	updateUser()
	.then(() => assignPath(`/user/read/${user.value.data.id}`))
	.catch(error => console.log(error))
}


async function archiveUser() {
	await fetcher.archive([ user.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}

async function restoreUser() {
	await fetcher.restore([ user.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}

onMounted(() => {
	fetcher = new Fetcher()
})
</script>
