<template>
	<Suspensible :is-loaded="isRolePresent">
		<form @submit.prevent="updateRole">
			<div class="role-name" v-if="role">
				<RoleNameField label="Role Name" type="text" v-model="role.name" :editable="true" />
			</div>

			<FlagSelector
				header="Semester"
				:base-permission-group="semesterPermissions"
				v-model:flags="role!.semesterFlags"/>
			<FlagSelector
				header="Tag"
				:base-permission-group="tagPermissions"
				v-model:flags="role!.tagFlags"/>
			<FlagSelector
				header="Post"
				:base-permission-group="postPermissions"
				v-model:flags="role!.postFlags"/>
			<FlagSelector
				header="Comment"
				:base-permission-group="commentPermissions"
				v-model:flags="role!.commentFlags"/>
			<FlagSelector
				header="Profanity"
				:base-permission-group="profanityPermissions"
				v-model:flags="role!.profanityFlags"/>
			<FlagSelector
				header="User"
				:base-permission-group="userPermissions"
				v-model:flags="role!.userFlags"/>
			<FlagSelector
				header="Audit Trail"
				:base-permission-group="auditTrailPermissions"
				v-model:flags="role!.auditTrailFlags"/>

			<button type="submit" class="btn btn-primary">Submit</button>
		</form>
	</Suspensible>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import {
	onMounted,
	inject,
	ref,
	computed
} from "vue"

import type { PageContext } from "#/types"
import type { DeserializedRoleDocument, DeserializedRoleResource } from "$/types/documents/role"

import RoleFetcher from "$@/fetchers/role"
import Suspensible from "@/suspensible.vue"
import deserialize from "$/helpers/deserialize"
import RoleNameField from "@/fields/textual.vue"
import FlagSelector from "@/role/flag_selector.vue"
import {
	semester as semesterPermissions,
	tag as tagPermissions,
	post as postPermissions,
	comment as commentPermissions,
	profanity as profanityPermissions,
	user as userPermissions,
	auditTrail as auditTrailPermissions
} from "$/permissions/permission_list"

const pageContext = inject("pageContext") as PageContext
const roleId = pageContext.routeParams!.id

RoleFetcher.initialize("/api")

const role = ref<null | DeserializedRoleResource>(null)

// TODO<permission_properties>: loop through permission properties to minimize manual rendering of FlagSelectors
// const permissionsProperties = ref<string[]>([])
const isRolePresent = computed(() => {
	return role.value !== null
})

onMounted(async () => {
	await new RoleFetcher().read(+roleId)
	.then(response => {
		const { body } = response
		const deserializedData = (deserialize(body)! as DeserializedRoleDocument).data
		role.value = deserializedData
		console.log(deserializedData)

		// TODO<permission_properties>: loop through permission properties to minimize manual rendering of FlagSelectors

		// Object.keys(role.value).map(key => {
		// 	if (key.toLocaleLowerCase().includes("flags")) {
		// 		permissionsProperties.value.push(key)
		// 	}
		// })

		// console.log(permissionsProperties.value)
	})
})

async function updateRole() {
	await new RoleFetcher().update(role.value!.id, {
		name: role.value!.name,
		type: role.value!.type,
		departmentFlags: role.value!.departmentFlags,
		roleFlags: role.value!.roleFlags,
		semesterFlags: role.value!.semesterFlags,
		tagFlags: role.value!.tagFlags,
		postFlags: role.value!.postFlags,
		commentFlags: role.value!.commentFlags,
		profanityFlags: role.value!.profanityFlags,
		userFlags: role.value!.userFlags,
		auditTrailFlags: role.value!.auditTrailFlags
	})
	.then(({body, status}) => {
		console.log(body, status)
	})
}

async function archiveRole() {

}

async function restoreRole() {

}
</script>
