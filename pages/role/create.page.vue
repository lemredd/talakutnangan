<template>
	<form @submit.prevent="createRole">
		<!-- TODO: capitalize each word in input automatically  -->
		<TextualField
			v-model="roleName"
			label="Role Name"
			type="text"/>

		<FlagSelector
			v-model="semesterFlags"
			header="Semester"
			:base-permission-group="semester"/>
		<FlagSelector
			v-model="tagFlags"
			header="Tag"
			:base-permission-group="tag"/>
		<FlagSelector
			v-model="postFlags"
			header="Post"
			:base-permission-group="post"/>
		<FlagSelector
			v-model="commentFlags"
			header="Comment"
			:base-permission-group="comment"/>
		<FlagSelector
			v-model="profanityFlags"
			header="Profanity"
			:base-permission-group="profanity"/>
		<FlagSelector
			v-model="userFlags"
			header="User"
			:base-permission-group="user"/>
		<FlagSelector
			v-model="auditTrailFlags"
			header="Audit Trail"
			:base-permission-group="auditTrail"/>

		<input
			class="btn btn-primary"
			type="submit"
			value="Create Role"/>
	</form>
</template>

<style scoped lang="scss">
@import "@styles/btn.scss";
.attrib-label {
	@apply block;
}

.flag-attrib{
	@apply border-solid;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import RoleFetcher from "$@/fetchers/role"
import {
	tag,
	user,
	post,
	comment,
	semester,
	profanity,
	auditTrail
} from "$/permissions/permission_list"
import TextualField from "@/fields/non-sensitive_text.vue"
import FlagSelector from "@/role/flag_selector.vue"

const roleName = ref("")

const postFlags = ref<number>(0)
const semesterFlags = ref<number>(0)
const tagFlags = ref<number>(0)
const commentFlags = ref<number>(0)
const profanityFlags = ref<number>(0)
const userFlags = ref<number>(0)
const auditTrailFlags = ref<number>(0)

let rawRoleFetcher: RoleFetcher|null = null

function roleFetcher(): RoleFetcher {
	if (rawRoleFetcher) return rawRoleFetcher

	throw new Error("Roles cannot be retrived/sent to server yet")
}

function createRole() {
	roleFetcher().create({
		"auditTrailFlags": auditTrailFlags.value,
		"commentFlags": commentFlags.value,
		"deletedAt": null,
		"departmentFlags": 1,
		"name": roleName.value,
		"postFlags": postFlags.value,
		"profanityFlags": profanityFlags.value,
		"roleFlags": 1,
		"semesterFlags": semesterFlags.value,
		"tagFlags": tagFlags.value,
		"userFlags": userFlags.value
	}).then(({ unusedBody, unusedStatus }) => {
		// Success
	}).catch(({ unusedBody, unusedStatus }) => {
		// Fail
	})
}

onMounted(() => {
	rawRoleFetcher = new RoleFetcher()
})
</script>
