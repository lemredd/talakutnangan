<template>
	<form @submit.prevent="updateRole">
		<div v-if="role" class="role-name">
			<RoleNameField
				v-model="role.data.name"
				label="Role Name"
				type="text"
				:editable="true"/>
		</div>

		<FlagSelector
			v-model="role.data.semesterFlags"
			header="Semester"
			:base-permission-group="semesterPermissions"/>
		<FlagSelector
			v-model="role.data.tagFlags"
			header="Tag"
			:base-permission-group="tagPermissions"/>
		<FlagSelector
			v-model="role.data.postFlags"
			header="Post"
			:base-permission-group="postPermissions"
			:dependent-permission-groups="[ commentPermissions] "/>
		<FlagSelector
			v-model="role.data.commentFlags"
			header="Comment"
			:base-permission-group="commentPermissions"/>
		<FlagSelector
			v-model="role.data.profanityFlags"
			header="Profanity"
			:base-permission-group="profanityPermissions"/>
		<FlagSelector
			v-model="role.data.userFlags"
			header="User"
			:base-permission-group="userPermissions"/>
		<FlagSelector
			v-model="role.data.auditTrailFlags"
			header="Audit Trail"
			:base-permission-group="auditTrailPermissions"/>

		<div class="controls flex justify-between">
			<button type="submit" class="btn btn-primary">
				Submit
			</button>
			<button
				v-if="isDeleted"
				type="button"
				class="btn btn-primary"
				@click="restoreRole">
				Restore
			</button>
			<button
				v-else
				type="button"
				class="btn btn-primary"
				@click="archiveRole">
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
	onMounted,
	onBeforeMount
} from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedRoleDocument } from "$/types/documents/role"

import RoleFetcher from "$@/fetchers/role"
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

type RequiredExtraProps = "role"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const role = ref<DeserializedRoleDocument<"read">>(
	pageProps.role as DeserializedRoleDocument<"read">
)
const isDeleted = computed<boolean>(() => Boolean(role.value.deletedAt))

onBeforeMount(() => {
	RoleFetcher.initialize("/api")
})

let rawRoleFetcher: RoleFetcher|null = null

function roleFetcher(): RoleFetcher {
	if (rawRoleFetcher) return rawRoleFetcher

	throw new Error("Roles cannot be retrived/sent to server yet")
}

async function updateRole() {
	await roleFetcher().update(role.value.data.id, {
		"auditTrailFlags": role.value.data.auditTrailFlags,
		"commentFlags": role.value.data.commentFlags,
		"deletedAt": role.value.data.deletedAt?.toJSON() ?? null,
		"departmentFlags": role.value.data.departmentFlags,
		"name": role.value.data.name,
		"postFlags": role.value.data.postFlags,
		"profanityFlags": role.value.data.profanityFlags,
		"roleFlags": role.value.data.roleFlags,
		"semesterFlags": role.value.data.semesterFlags,
		"tagFlags": role.value.data.tagFlags,
		"type": role.value.data.type,
		"userFlags": role.value.data.userFlags
	})
	.then(({ body, status }) => {
		console.log(body, status)
	})
}

async function archiveRole() {
	await roleFetcher().archive([ role.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}

async function restoreRole() {
	await roleFetcher().restore([ role.value.data.id ])
	.then(({ body, status }) => {
		console.log(body, status)
	})
}

onMounted(() => {
	rawRoleFetcher = new RoleFetcher()
})
</script>
