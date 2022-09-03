<template>
	<form @submit.prevent="createRole">
		<!-- TODO: capitalize each word in input automatically  -->
		<TextualField
			v-model="roleName"
			label="Role Name"
			type="text"/>

		<FlagSelector
			v-model:flags="semesterFlags"
			header="Semester"
			:base-permission-group="semester"/>
		<FlagSelector
			v-model:flags="tagFlags"
			header="Tag"
			:base-permission-group="tag"/>
		<FlagSelector
			v-model:flags="postFlags"
			header="Post"
			:base-permission-group="post"/>
		<FlagSelector
			v-model:flags="commentFlags"
			header="Comment"
			:base-permission-group="comment"/>
		<FlagSelector
			v-model:flags="profanityFlags"
			header="Profanity"
			:base-permission-group="profanity"/>
		<FlagSelector
			v-model:flags="userFlags"
			header="User"
			:base-permission-group="user"/>
		<FlagSelector
			v-model:flags="auditTrailFlags"
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
import { ref } from "vue"
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
import TextualField from "@/fields/textual.vue"
import FlagSelector from "@/role/flag_selector.vue"

const roleName = ref("")

const postFlags = ref<number>(0)
const semesterFlags = ref<number>(0)
const tagFlags = ref<number>(0)
const commentFlags = ref<number>(0)
const profanityFlags = ref<number>(0)
const userFlags = ref<number>(0)
const auditTrailFlags = ref<number>(0)

RoleFetcher.initialize("/api")

function createRole() {
	new RoleFetcher().create({
		"name": roleName.value,
		"postFlags": postFlags.value,
		"semesterFlags": semesterFlags.value,
		"tagFlags": tagFlags.value,
		"commentFlags": commentFlags.value,
		"profanityFlags": profanityFlags.value,
		"userFlags": userFlags.value,
		"auditTrailFlags": auditTrailFlags.value,
		"departmentFlags": 1,
		"roleFlags": 1
	}).then(({ unusedBody, unusedStatus }) => {
		// Success
	}).catch(({ unusedBody, unusedStatus }) => {
		// Fail
	})
}
</script>
