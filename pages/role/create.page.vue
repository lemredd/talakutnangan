<template>
	<form @submit.prevent="createRole">
		<label class="block">
			Role name:
			<input class="border-solid" type="text" id="full-name" v-model="roleName"/>
		</label>
		<div class="post-flags">
			<h2>Post Flags</h2>
			<label class="block" v-for="permissionName in postPermissionNames">
				<span>Can {{permissionName}} </span>
				<input class="border-solid" type="checkbox" :value="permissionName" @change="updateFlags" v-model="postRawFlags"/>

			</label>
			<!-- <label class="block">
				Can View Posts:
				<input class="border-solid" type="checkbox" id="view-post-flag" v-model="postRawFlags"/>
			</label>
			<label class="block">
				Can Write Posts:
				<input class="border-solid" type="checkbox" id="post-flags" v-model="postRawFlags"/>
			</label>
			<label class="block">
				Can Write Posts:
				<input class="border-solid" type="checkbox" id="post-flags" v-model="postRawFlags"/>
			</label> -->
		</div>

		<input type="submit" value="Create Role"/>
	</form>
</template>

<style>
</style>

<script setup lang="ts">
import { computed, inject, ref, watch } from "vue"
import RoleFetcher from "$@/communicators/role"
import type { DeserializedPageContext } from "$@/types/independent"
import { post } from "$/permissions/permission_list"
import type { Permissions as PostPermissions } from "$/permissions/post_permissions"


const pageContext = inject("pageContext") as DeserializedPageContext

const roleName = ref("")

const postRawFlags = ref<PostPermissions[]>([])
const postFlags = computed(function (): number {
	return post.generateMask(...postRawFlags.value)
})
const postPermissionNames = Array.from(post.permissions.keys())

// console.info(postPermissionNames)
function updateFlags(e: Event) {
	const postPermissionDependencies = new Set([...postRawFlags.value])

	post.permissions.forEach((info, permissionName) => {
		if (postPermissionDependencies.has(permissionName)) {
			info.permissionDependencies.forEach(n => {
				console.info("Is dependency?", n, postPermissionDependencies.has(n))
				postPermissionDependencies.add(n)
			})
		}
	})

	postRawFlags.value = [...postPermissionDependencies]
}

watch(postRawFlags, () => {
	// const postPermissionDependencies = new Set([...postRawFlags.value])
	// const originalPermissions = new Set([...postRawFlags.value])

	// post.permissions.forEach((info, permissionName) => {
	// 	if (postPermissionDependencies.has(permissionName)) {
	// 		info.permissionDependencies.forEach(n => {
	// 			console.info("Is dependency?", n, postPermissionDependencies.has(n))
	// 			postPermissionDependencies.add(n)
	// 		})
	// 	}
	// })

	// postRawFlags.value = [...postPermissionDependencies]
})
watch(postFlags, () => console.log(postFlags.value))



const semesterFlags = ref<number>(0)
const tagFlags = ref<number>(0)
const commentFlags = ref<number>(0)
const profanityFlags = ref<number>(0)
const userFlags = ref<number>(0)
const auditTrailFlags = ref<number>(0)


RoleFetcher.initialize("/api")

function createRole() {
	RoleFetcher.create({
		name: roleName.value,
	})
	.then(({ body, status }) => {
		console.log(body, status)

		if (status >= 400) {
			// Output error
		}
	})
}
</script>
