<template>
	<article>
		<UpdatePostForm
			v-model="post"
			:is-shown="mustUpdate"
			@submit="submitChangesSeparately"
			@close="closeUpdateForm"/>
		<Overlay :is-shown="mustArchiveOrRestore" @close="closeArchiveOrRestore">
			<template #header>
				<h1>Enter the post details</h1>
			</template>
			<template #default>
				<ReceivedErrors v-if="receivedErrors.length" :received-errors="receivedErrors"/>
				<ReceivedSuccessMessages
					v-if="successMessages.length"
					:received-success-messages="successMessages"/>
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
				<div class="poster">
					<ProfilePicture
						class="profile-picture"
						:user="post.poster"/>
					<div class="poster-details">
						<span>
							{{ post.poster.data.name }}
						</span>
						<span>
							<small class="department-and-timestamp">
								<span>
									{{ postDepartment }}
								</span>
								<span class="timestamp" :title="completeFriendlyPostTimestamp">
									{{
										friendlyPostTimestamp
									}}
								</span>
							</small>
						</span>
					</div>
				</div>
				<Menu
					:post="post"
					@update-post="openUpdateForm"
					@archive-post="confirmArchive"
					@restore-post="confirmRestore"/>
			</div>
		</header>
		<p class="post-content">
			{{ post.content }}
		</p>
		<div v-if="hasExistingAttachments">
			<div
				v-for="attachment in postAttachments"
				:key="attachment.id"
				class="preview-file">
				<div v-if="isImage(attachment.fileType)" class="preview-img-container">
					<div class="removable-image relative">
						<img class="preview-img" :src="attachment.fileContents"/>
					</div>
					<small class="preview-title">
						Attachment {{ attachment.id }}
					</small>
				</div>
				<div
					v-else
					class="preview-file-container">
					<span class="material-icons mr-2">
						attachment
					</span>
					<small class="preview-file-title">
						Attachment {{ attachment.id }}
					</small>
				</div>
			</div>
		</div>
		<a :href="readPostPath" class="comment-count">
			<span class="material-icons icon">
				comment
			</span>
			<span>
				{{ friendlyCommentCount }}
			</span>
		</a>
	</article>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";

	.post-content {
		word-break: normal;
	}

	article {
		@apply flex flex-col flex-nowrap justify-between;
		@apply p-2 bg-gray-400 bg-opacity-10 shadow-md;

		header {
			@apply flex flex-row justify-between;

			.post-details {
				@apply flex-1 flex flex-row justify-between;

				.poster {
					@apply flex flex-row items-start;
					.profile-picture {
						@apply mr-2 flex-initial w-auto h-12;
					}

					.poster-details {
						@apply flex flex-col;

						.department-and-timestamp {
							@apply flex flex-col sm:flex-row;

							.timestamp {
								@apply sm:ml-2;
							}
						}
					}
				}
			}
		}

		.comment-count {
			@apply flex-initial mt-10 flex flex-row flex-nowrap justify-start items-center;
		}

		> p {
			word-break: normal;
			word-wrap: normal;
		}
	}

	.icon { @apply mr-2; }
</style>

<script setup lang="ts">
import { ref, computed } from "vue"

import type { DeserializedPostResource } from "$/types/documents/post"
import type {
	DeserializedPostAttachmentResource,
	DeserializedPostAttachmentListDocument
} from "$/types/documents/post_attachment"

import { READ_POST } from "$/constants/template_page_paths"

import Fetcher from "$@/fetchers/post"
import pluralize from "$/string/pluralize"
import makeSwitch from "$@/helpers/make_switch"
import isUndefined from "$/type_guards/is_undefined"
import specializePath from "$/helpers/specialize_path"
import fillSuccessMessages from "$@/helpers/fill_success_messages"
import extractAllErrorDetails from "$@/helpers/extract_all_error_details"
import formatToFriendlyPastTime from "$@/helpers/format_to_friendly_past_time"


import formatToCompleteFriendlyTime from "$@/helpers/format_to_complete_friendly_time"
import ReceivedErrors from "@/helpers/message_handlers/received_errors.vue"
import ReceivedSuccessMessages from "@/helpers/message_handlers/received_success_messages.vue"
import Overlay from "@/helpers/overlay.vue"
import Menu from "@/post/multiviewer/viewer/menu.vue"
import ProfilePicture from "@/consultation/list/profile_picture_item.vue"
import UpdatePostForm from "@/post/multiviewer/viewer/update_post_form.vue"
import assignPath from "$@/external/assign_path"

const fetcher = new Fetcher()

function isImage(type: string): boolean {
	return type.includes("image")
}

const props = defineProps<{
	commentCount: number,
	modelValue: DeserializedPostResource<"poster"|"posterRole"|"department">
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

const hasExistingAttachments = computed<boolean>(() => {
	const hasAttachments = !isUndefined(props.modelValue.postAttachments)

	return hasAttachments
})
const postAttachments = computed<DeserializedPostAttachmentResource[]>(() => {
	if (hasExistingAttachments.value) {
		const attachments = props.modelValue
		.postAttachments as DeserializedPostAttachmentListDocument

		return attachments.data
	}

	return []
})

const {
	"state": mustUpdate,
	"on": openUpdateForm,
	"off": closeUpdateForm
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

const receivedErrors = ref<string[]>([])
const successMessages = ref<string[]>([])
const mustArchiveOrRestore = computed<boolean>(() => mustArchive.value || mustRestore.value)

function closeArchiveOrRestore() {
	receivedErrors.value = []
	successMessages.value = []
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

const friendlyCommentCount = computed<string>(() => pluralize("comment", props.commentCount))

const readPostPath = computed<string>(() => {
	const postID = post.value.id

	const path = specializePath(READ_POST, {
		"id": postID
	})

	return path
})

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

function closeDialog() {
	emit("archive", post.value)
	emit("restore", post.value)
}


async function archivePost(): Promise<void> {
	await fetcher.archive([ post.value.id ])
	.then(() => {
		fillSuccessMessages(receivedErrors, successMessages)
		setTimeout(closeDialog, 5000)
		assignPath("/forum")
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
}

async function restorePost(): Promise<void> {
	await fetcher.restore([ post.value.id ])
	.then(() => {
		fillSuccessMessages(receivedErrors, successMessages)
		setTimeout(closeDialog, 5000)
		assignPath("/forum")
	})
	.catch(responseWithErrors => extractAllErrorDetails(responseWithErrors, receivedErrors))
}
</script>
