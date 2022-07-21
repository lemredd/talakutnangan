<template>
	<form @submit.prevent="createRole">
		<label class="block">
			Role name:
			<input class="border-solid" type="text" id="full-name" v-model="roleName"/>
		</label>
		<div class="post-flags">
			<h2>Post Flags</h2>
			<label class="block" v-for="permissionName in postPermissionNames">
				<span>Can {{camelToSentence(permissionName).toLowerCase() }} </span>
				<input class="border-solid" type="checkbox" :value="permissionName" @change="updatePostFlags" v-model="postRawFlags"/>

			</label>
			</label>
		</div>

		<input type="submit" value="Create Role"/>
	</form>
</template>

<style>
</style>

<script setup lang="ts">
import { computed, inject, ref } from "vue"
import RoleFetcher from "$@/communicators/role"
import type { DeserializedPageContext } from "$@/types/independent"
import { post, semester } from "$/permissions/permission_list"

import type { Permissions as SemesterPermissions } from "$/permissions/semester_permissions"
import type { Permissions as PostPermissions } from "$/permissions/post_permissions"
import camelToSentence from "$@/helpers/camel_to_sentence"

const pageContext = inject("pageContext") as DeserializedPageContext

const roleName = ref("")

const postRawFlags = ref<PostPermissions[]>([])
const postFlags = computed(function (): number {
	return post.generateMask(...postRawFlags.value)
})
const postPermissionNames = Array.from(post.permissions.keys())
function updatePostFlags() {
	const postPermissionDependencies = new Set([...postRawFlags.value])

	post.permissions.forEach((info, permissionName) => {
		if (postPermissionDependencies.has(permissionName)) {
			info.permissionDependencies.forEach(n => {
				postPermissionDependencies.add(n)
			})
		}
	})

	postRawFlags.value = [...postPermissionDependencies]
}

})



const tagFlags = ref<number>(0)
const commentFlags = ref<number>(0)
const profanityFlags = ref<number>(0)
const userFlags = ref<number>(0)
const auditTrailFlags = ref<number>(0)


RoleFetcher.initialize("/api")

function createRole() {
	RoleFetcher.create({
		name: roleName.value,
		postFlags: postFlags.value,
		semesterFlags: semesterFlags.value,
		tagFlags: tagFlags.value,
		commentFlags: commentFlags.value,
		profanityFlags: profanityFlags.value,
		userFlags: userFlags.value,
		auditTrailFlags: auditTrailFlags.value
	})
	.then(({ body, status }) => {
		console.log(body, status)

		if (status >= 400) {
			// Output error
		}
	})
}
</script>
