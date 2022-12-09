<template>
	<MaintenanceMessage v-if="isInMaintenanceMode"/>
	<div v-else>
		<div v-if="hasProfile" class="post-preview">
			<div v-if="hasPosts">
				<Viewer
					v-for="(post, i) in posts.data"
					:key="post.id"
					v-model="posts.data[i]"
					:may-have-menu="false"
					:comment-count="posts.data[i].meta?.commentCount || 0"
					class="viewer"
					@archive="archivePost"
					@restore="restorePost"/>
			</div>
			<p class="empty-post" v-else>
				There are no posts found in the forum.
			</p>
		</div>
		<Opening v-else/>
		<Instructions/>
		<ChangePassword v-if="hasDefaultPassword"/>
	</div>
</template>

<style lang="scss" scoped>
	.post-preview {
		@apply flex flex-col;

		.viewer {
			@apply flex-1 my-4;
		}

		.empty-post {
			@apply my-2 text-center;
		}
	}
</style>

<script lang="ts" setup>
import { inject, ref, computed } from "vue"

import type { PageContext } from "$/types/renderer"
import type {
	DeserializedPostResource,
	DeserializedPostListDocument
} from "$/types/documents/post"

import isUndefined from "$/type_guards/is_undefined"

import Viewer from "@/post/multiviewer/viewer.vue"
import Opening from "@/guest_homepage/opening.vue"
import Instructions from "@/guest_homepage/instructions.vue"
import ChangePassword from "@/authentication/change_password.vue"
import MaintenanceMessage from "@/helpers/maintenance_message.vue"

type RequiredExtraProps = "posts"
const { pageProps } = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { userProfile, isInMaintenanceMode } = pageProps

const posts = ref<DeserializedPostListDocument>(pageProps.posts)
const hasPosts = computed<boolean>(() => (posts.value?.data?.length ?? 0) > 0)

const hasProfile = Boolean(userProfile)

const hasDefaultPassword = hasProfile
	&& !isUndefined(userProfile.meta.hasDefaultPassword)
	&& userProfile.meta.hasDefaultPassword

function archivePost(postToRemove: DeserializedPostResource) {
	// To be done
}

function restorePost(postToRemove: DeserializedPostResource) {
	// To be done
}
</script>
