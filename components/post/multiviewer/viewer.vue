<template>
	<section>
		<UpdatePostForm
			v-model="post"
			:is-shown="mustUpdate"
			@submit="submitChangesSeparately"/>
		<Overlay :is-shown="mustArchiveOrRestore" @close="closeArchiveOrRestore">
			<template #header>
				<h1>Enter the post details</h1>
			</template>
			<template #default>
				<p v-if="mustArchive">
					Do you really want to archive?
				</p>
				<p v-if="mustRestore">
					Do you really want to restore?
				</p>
			</template>
			<template #footer>
				<button
					class="btn btn-back"
					type="button"
					@click="closeArchiveOrRestore">
					Back
				</button>
				<button
					v-if="mustArchive"
					class="btn submit-btn btn-primary"
					type="button"
					@click="archivePost">
					Archive post
				</button>
				<button
					v-if="mustRestore"
					class="btn submit-btn btn-primary"
					type="button"
					@click="restorePost">
					Restore post
				</button>
			</template>
		</Overlay>
		<header>
			<div class="post-details">
				<ProfilePicture
					class="profile-picture"
					:user="post.poster"/>
				<span>
					{{ post.poster.data.name }}
				</span>
				<span>
					<small>
						<span>
							{{ postDepartment }}
						</span>
						<span class="ml-2" :title="completeFriendlyPostTimestamp">
							{{
								friendlyPostTimestamp
							}}
						</span>
					</small>
				</span>
			</div>
			<Menu
				:post="post"
				@update-post="openUpdateForm"
				@archive-post="confirmArchive"
				@restore-post="confirmRestore"/>
		</header>
		<p>
			{{ post.content }}
		</p>
		<p class="comment-count">
			<span class="material-icons icon">
				comment
			</span>
			<span>
				{{ friendlyCommentCount }}
			</span>
		</p>
	</section>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";

	section {
		@apply flex flex-col flex-nowrap justify-between;
		@apply p-5 bg-light-800 shadow-lg rounded-[1rem] min-w-70;

		header {
			@apply flex-1 flex flex-row justify-between;

			.post-details {
				@apply flex-1 flex flex-row flex-wrap;

				.profile-picture {
					@apply mb-5 flex-initial w-auto h-6;

					+ span {
						@apply flex-1;
					}
				}
			}
		}

		.comment-count {
			@apply flex-initial mt-10 flex flex-row flex-nowrap justify-start items-center;
		}
	}

	.icon { @apply mr-2; }
</style>

<script setup lang="ts">
import { ref, computed } from "vue"

import type { DeserializedPostResource } from "$/types/documents/post"

import Fetcher from "$@/fetchers/post"
import makeSwitch from "$@/helpers/make_switch"
import isUndefined from "$/type_guards/is_undefined"
import formatToFriendlyPastTime from "$@/helpers/format_to_friendly_past_time"
import formatToCompleteFriendlyTime from "$@/helpers/format_to_complete_friendly_time"

import Overlay from "@/helpers/overlay.vue"
import Menu from "@/post/multiviewer/viewer/menu.vue"
import ProfilePicture from "@/consultation/list/profile_picture_item.vue"
import UpdatePostForm from "@/post/multiviewer/viewer/update_post_form.vue"

const fetcher = new Fetcher()

const props = defineProps<{
	commentCount: number,
	modelValue: DeserializedPostResource<"poster"|"posterRole"|"department"|"department">
}>()

interface CustomEvents {
	(
		event: "update:modelValue",
		post: DeserializedPostResource<"poster"|"posterRole"|"department"
	>): void
	(event: "archive", post: DeserializedPostResource<"poster"|"posterRole"|"department">): void
	(event: "restore", post: DeserializedPostResource<"poster"|"posterRole"|"department">): void
}
const emit = defineEmits<CustomEvents>()

const post = ref<DeserializedPostResource<"poster"|"posterRole"|"department">>(props.modelValue)

const {
	"state": mustUpdate,
	"on": openUpdateForm
} = makeSwitch(false)

const {
	"state": mustArchive,
	"on": confirmArchive,
	"off": closeArchive
} = makeSwitch(false)

const {
	"state": mustRestore,
	"on": confirmRestore,
	"off": closeRestore
} = makeSwitch(false)

const mustArchiveOrRestore = computed<boolean>(() => mustArchive.value || mustRestore.value)

function closeArchiveOrRestore() {
	closeArchive()
	closeRestore()
}

const postDepartment = computed<string>(() => {
	const { department } = post.value

	if (isUndefined(department)) {
		return "Posted to all"
	}

	return `Posted on ${department.data.fullName} (${department.data.acronym})`
})

const friendlyPostTimestamp = computed<string>(() => {
	const { createdAt } = post.value

	return formatToFriendlyPastTime(createdAt)
})

const completeFriendlyPostTimestamp = computed<string>(() => {
	const { createdAt, updatedAt } = post.value
	const friendlyCreationTime = formatToCompleteFriendlyTime(createdAt)
	const friendlyModificationTime = formatToCompleteFriendlyTime(updatedAt)

	return `Created at: ${friendlyCreationTime}\nUpdated at: ${friendlyModificationTime}`
})

const friendlyCommentCount = computed<string>(() => `${props.commentCount} comments`)

async function submitChangesSeparately(): Promise<void> {
	await fetcher.update(post.value.id, {
		"content": post.value.content,
		"createdAt": post.value.createdAt.toJSON(),
		"deletedAt": null,
		"updatedAt": post.value.updatedAt.toJSON()
	}, {
		"extraDataFields": {
			"relationships": {
				// eslint-disable-next-line no-undefined
				"department": undefined,
				// eslint-disable-next-line no-undefined
				"postAttachments": undefined,
				"poster": {
					"data": {
						"id": post.value.poster.data.id,
						"type": "user"
					}
				},
				"posterRole": {
					"data": {
						"id": post.value.posterRole.data.id,
						"type": "role"
					}
				}
			}
		}
	}).then(() => {
		emit("update:modelValue", post.value)
	})
}

async function archivePost(): Promise<void> {
	await fetcher.archive([ post.value.id ]).then(() => {
		emit("archive", post.value)
	})
}

async function restorePost(): Promise<void> {
	await fetcher.restore([ post.value.id ]).then(() => {
		emit("restore", post.value)
	})
}
</script>
