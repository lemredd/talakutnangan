<template>
	<Suspensible :is-loaded="isRolePresent">
		<form @submit.prevent="updateRole">
			<div v-if="role" class="role-name">
				<RoleNameField
					v-model="role.name"
					label="Role Name"
					type="text"
					:editable="true"/>
			</div>

			<FlagSelector
				v-model:flags="role!.semesterFlags"
				header="Semester"
				:base-permission-group="semesterPermissions"/>
			<FlagSelector
				v-model:flags="role!.tagFlags"
				header="Tag"
				:base-permission-group="tagPermissions"/>
			<FlagSelector
				v-model:flags="role!.postFlags"
				header="Post"
				:base-permission-group="postPermissions"/>
			<FlagSelector
				v-model:flags="role!.commentFlags"
				header="Comment"
				:base-permission-group="commentPermissions"/>
			<FlagSelector
				v-model:flags="role!.profanityFlags"
				header="Profanity"
				:base-permission-group="profanityPermissions"/>
			<FlagSelector
				v-model:flags="role!.userFlags"
				header="User"
				:base-permission-group="userPermissions"/>
			<FlagSelector
				v-model:flags="role!.auditTrailFlags"
				header="Audit Trail"
				:base-permission-group="auditTrailPermissions"/>

			<div class="controls flex justify-between">
				<button type="submit" class="btn btn-primary">
					Submit
				</button>
				<button
					type="button"
					class="btn btn-primary"
					@click="archiveOrRestore">
					{{
						role!.deletedAt
							? "Restore"
							: "Archive"
					}}
				</button>
			</div>
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

import type { PageContext } from "$/types/renderer"
import type { DeserializedRoleResource } from "$/types/documents/role"

import RoleFetcher from "$@/fetchers/role"
import Suspensible from "@/suspensible.vue"
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

/*
 * TODO<permission_properties>: loop through permission properties to minimize manual rendering of
 * FlagSelectors const permissionsProperties = ref<string[]>([])
 */
const isRolePresent = computed(() => role.value !== null)

onMounted(async() => {
	await new RoleFetcher().read(roleId)
	.then(response => {
		const { body } = response
		const deserializedData = body.data
		role.value = deserializedData

		/*
		 * TODO<permission_properties>: loop through permission properties to minimize manual
		 * rendering of FlagSelectors
		 */

		/*
		 * Object.keys(role.value).map(key => {
		 *    if (key.toLocaleLowerCase().includes("flags")) {
		 *       permissionsProperties.value.push(key)
		 *    }
		 * })
		 */

		// Console.log(permissionsProperties.value)
	})
})

async function updateRole() {
	await new RoleFetcher().update(role.value!.id, {
		"name": role.value!.name,
		"type": role.value!.type,
		"departmentFlags": role.value!.departmentFlags,
		"roleFlags": role.value!.roleFlags,
		"semesterFlags": role.value!.semesterFlags,
		"tagFlags": role.value!.tagFlags,
		"postFlags": role.value!.postFlags,
		"commentFlags": role.value!.commentFlags,
		"profanityFlags": role.value!.profanityFlags,
		"userFlags": role.value!.userFlags,
		"auditTrailFlags": role.value!.auditTrailFlags
	})
	.then(({ body, status }) => {
		console.log(body, status)
	})
}

function archiveOrRestore() {
	if (role.value!.deletedAt) restoreRole()
	else archiveRole()
}

async function archiveRole() {
	await new RoleFetcher().archive([ role.value!.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}

async function restoreRole() {
	await new RoleFetcher().restore([ role.value!.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}
</script>
