<template>
	<form @submit.prevent="createRole">
		<!-- TODO: capitalize each word in input automatically  -->
		<TextualField
				label="Role Name"
				type="text"
				v-model="roleName" />

		<FlagSelector
			header="Semester"
			:base-permission-group="semester"
			v-model:flags="semesterFlags" />
		<FlagSelector
			header="Tag"
			:base-permission-group="tag"
			v-model:flags="tagFlags" />
		<FlagSelector
			header="Post"
			:base-permission-group="post"
			v-model:flags="postFlags" />
		<FlagSelector
			header="Comment"
			:base-permission-group="comment"
			v-model:flags="commentFlags" />
		<FlagSelector
			header="Profanity"
			:base-permission-group="profanity"
			v-model:flags="profanityFlags" />
		<FlagSelector
			header="User"
			:base-permission-group="user"
			v-model:flags="userFlags" />
		<FlagSelector
			header="Audit Trail"
			:base-permission-group="auditTrail"
			v-model:flags="auditTrailFlags" />

		<input class="btn btn-primary" type="submit" value="Create Role"/>
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
import { RoleAttributes } from "$/types/documents/role"

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
		name: roleName.value,
		postFlags: postFlags.value,
		semesterFlags: semesterFlags.value,
		tagFlags: tagFlags.value,
		commentFlags: commentFlags.value,
		profanityFlags: profanityFlags.value,
		userFlags: userFlags.value,
		auditTrailFlags: auditTrailFlags.value,
		departmentFlags: 1,
		roleFlags: 1
	} as RoleAttributes)
	.then(({ body, status }) => {
		console.log(body, status)

		if (status >= 400) {
			// Output error
		}
	})
}
</script>
