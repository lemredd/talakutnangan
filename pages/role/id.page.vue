<template>
	<Suspensible :is-loaded="isRolePresent">
		<div class="role-name" v-if="role">
			<h1>{{ role.name }}</h1>
		</div>

		<FlagSelector
			header="Department"
			:base-permission-group="departmentPermissions"
			:flags="role!.departmentFlags"/>
		<FlagSelector
			header="Role"
			:base-permission-group="rolePermissions"
			:flags="role!.roleFlags"/>
		<FlagSelector
			header="Semester"
			:base-permission-group="semesterPermissions"
			:flags="role!.semesterFlags"/>
		<FlagSelector
			header="Tag"
			:base-permission-group="tagPermissions"
			:flags="role!.tagFlags"/>
		<FlagSelector
			header="Post"
			:base-permission-group="postPermissions"
			:flags="role!.postFlags"/>
		<FlagSelector
			header="Comment"
			:base-permission-group="commentPermissions"
			:flags="role!.commentFlags"/>
		<FlagSelector
			header="Profanity"
			:base-permission-group="profanityPermissions"
			:flags="role!.profanityFlags"/>
		<FlagSelector
			header="User"
			:base-permission-group="userPermissions"
			:flags="role!.userFlags"/>
		<FlagSelector
			header="Audit Trail"
			:base-permission-group="auditTrailPermissions"
			:flags="role!.auditTrailFlags"/>
	</Suspensible>

</template>

<style>
</style>

<script setup lang="ts">
import {
	department as departmentPermissions,
	role as rolePermissions,
	semester as semesterPermissions,
	tag as tagPermissions,
	post as postPermissions,
	comment as commentPermissions,
	profanity as profanityPermissions,
	user as userPermissions,
	auditTrail as auditTrailPermissions
} from "$/permissions/permission_list"
import { onMounted, inject, ref, computed } from "vue"

import type { PageContext } from "#/types"
import type { DeserializedRoleDocument, DeserializedRoleResource } from "$/types/documents/role"

import RoleFetcher from "$@/fetchers/role"
import Suspensible from "@/suspensible.vue"
import deserialize from "$/helpers/deserialize"
import FlagSelector from "@/role/flag_selector.vue"

const pageContext = inject("pageContext") as PageContext
const roleId = pageContext.routeParams!.id

RoleFetcher.initialize("/api")

const role = ref<null | DeserializedRoleResource>(null)
const permissionsProperties = ref<string[]>([])
const isRolePresent = computed(() => {
	return role.value !== null
})

onMounted(async () => {
	await new RoleFetcher().read(+roleId)
	.then(response => {
		const { body } = response
		const deserializedData = (deserialize(body)! as DeserializedRoleDocument).data
		role.value = deserializedData

		// Object.keys(role.value).map(key => {
		// 	if (key.toLocaleLowerCase().includes("flags")) {
		// 		permissionsProperties.value.push(key)
		// 	}
		// })

		// console.log(permissionsProperties.value)
	})
})
</script>
