<template>
	<form @submit.prevent="createRole">
		<TextualField
				label="Display Name"
				type="text"
				v-model="roleName" />

		<FlagSelector
			header="Post"
			:base-permission-group="post"
			v-model:flags="postFlags" />
		<FlagSelector
			header="Semester"
			:base-permission-group="semester"
			v-model:flags="semesterFlags" />
		<FlagSelector
			header="Tag"
			:base-permission-group="tag"
			v-model:flags="tagFlags" />
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

		<input type="submit" value="Create Role"/>
	</form>
</template>

<style scoped lang="scss">
.attrib-label {
	@apply block;
}

.flag-attrib{
	@apply border-solid;
}
</style>

<script setup lang="ts">
import { inject, ref } from "vue"
import RoleFetcher from "$@/communicators/role"
import type { DeserializedPageContext } from "$@/types/independent"
import {
	tag,
	user,
	post,
	comment,
	semester,
	profanity
} from "$/permissions/permission_list"
import TextualField from "@/fields/textual.vue"
import FlagSelector from "@/role/flag_selector.vue"

const pageContext = inject("pageContext") as DeserializedPageContext

const roleName = ref("")

const postFlags = ref<number>(0)
const semesterFlags = ref<number>(0)
const tagFlags = ref<number>(0)
const commentFlags = ref<number>(0)
const profanityFlags = ref<number>(0)
const userFlags = ref<number>(0)

RoleFetcher.initialize("/api")

function createRole() {
	RoleFetcher.create({
		name: roleName.value,
		postFlags: postFlags.value,
		semesterFlags: semesterFlags.value,
		tagFlags: tagFlags.value,
		commentFlags: commentFlags.value,
		profanityFlags: profanityFlags.value,
		userFlags: userFlags.value
	})
	.then(({ body, status }) => {
		console.log(body, status)

		if (status >= 400) {
			// Output error
		}
	})
}
</script>
