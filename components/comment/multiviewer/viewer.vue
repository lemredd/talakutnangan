<template>
	<section v-if="mustDisplayOnly">
		<header>
			<ProfilePicture
				class="profile-picture"
				:user="comment.user"/>
			<h3>
				<span>
					{{ comment.user.data.name }}
				</span>
				<span class="timestamp" :title="completeFriendlyCommentTimestamp">
					{{ friendlyCommentTimestamp }}
				</span>
			</h3>
		</header>
		<div class="main-content">
			<p>
				{{ comment.content }}
			</p>
			<Menu
				class="flex-none m-auto mx-1 h-12 w-12"
				:comment="comment"
				@update-comment="openUpdateField"
				@archive-comment="confirmArchive"
				@restore-comment="confirmRestore"/>
			<Overlay :is-shown="mustArchiveOrRestore" @close="closeArchiveOrRestore">
				<template #header>
					<h1>Enter the comment details</h1>
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
						@click="archiveComment">
						Archive comment
					</button>
					<button
						v-if="mustRestore"
						class="btn submit-btn btn-primary"
						type="button"
						@click="restoreComment">
						Restore comment
					</button>
				</template>
			</Overlay>
		</div>
		<VoteView
			v-if="mayVote"
			:model-value="vote"
			:is-loaded="hasRenewedVote"
			:title="friendlyVoteCount"
			@update:model-value="switchVote"/>
	</section>
	<UpdateCommentField
		v-else
		:model-value="comment"
		@update:model-value="closeUpdateCommentField"/>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";

	section {
		@apply mb-12 pb-4;
		border-bottom: 1px solid hsla(0,0%,60%,0.3);
		@apply flex flex-col flex-nowrap;

		header {
			@apply flex-1 flex flex-row flex-nowrap;

			.profile-picture {
				@apply flex-initial w-auto h-12 mr-2;
			}

			h3 {
				@apply flex-1 flex flex-col flex-nowrap;
				@apply m-auto;

				span:nth-child(1) {
					@apply text-sm;
					@apply flex-1 truncate flex-shrink-[2];
				}

				.timestamp {
					@apply text-xs;
				}
			}
		}

		.main-content {
			@apply flex-1 flex flex-row flex-nowrap items-center;

			@screen md {
				width: 100%;
			}

			> p {
				@apply overflow-ellipsis;
				@apply flex-1;
				@apply ml-auto p-5;

				word-break: break-all;
			}
		}
	}
</style>

<script setup lang="ts">
import { ref, computed, inject, nextTick } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { DeserializedCommentResource, CompleteVoteKind } from "$/types/documents/comment"

import Fetcher from "$@/fetchers/comment"
import makeSwitch from "$@/helpers/make_switch"
import isUndefined from "$/type_guards/is_undefined"
import formatToFriendlyPastTime from "$@/helpers/format_to_friendly_past_time"
import formatToCompleteFriendlyTime from "$@/helpers/format_to_complete_friendly_time"

import { comment as permissionGroup } from "$/permissions/permission_list"
import {
	ARCHIVE_AND_RESTORE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT,
	VOTE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT,
	VOTE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT,
	VOTE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT
} from "$/permissions/comment_combinations"

import Overlay from "@/helpers/overlay.vue"
import VoteFetcher from "$@/fetchers/comment_vote"
import Menu from "@/comment/multiviewer/viewer/menu.vue"
import VoteView from "@/comment/multiviewer/viewer/vote_view.vue"
import ProfilePicture from "@/consultation/list/profile_picture_item.vue"
import UpdateCommentField from "@/comment/multiviewer/viewer/update_field.vue"

const fetcher = new Fetcher()
const voteFetcher = new VoteFetcher()

const props = defineProps<{
	modelValue: DeserializedCommentResource<"user">
}>()

interface CustomEvents {
	(event: "update:modelValue", comment: DeserializedCommentResource<"user">): void
	(event: "archive", comment: DeserializedCommentResource<"user">): void
	(event: "restore", comment: DeserializedCommentResource<"user">): void
}
const emit = defineEmits<CustomEvents>()

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext

const { userProfile } = pageProps

const hasRenewedVote = ref<boolean>(true)
const mayVoteComment = computed<boolean>(() => {
	const user = props.modelValue.user as DeserializedUserDocument<"department">
	const isLimitedPersonalScope = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		VOTE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
	]) && user.data.id === userProfile.data.id

	const departmentID = user.data.department.data.id
	const isLimitedUpToDepartmentScope = !isLimitedPersonalScope
		&& permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			VOTE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT
		]) && user.data.department.data.id === departmentID

	const isLimitedUpToGlobalScope = !isLimitedUpToDepartmentScope
		&& permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			VOTE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT
		])

	const isPermitted = isLimitedPersonalScope
	|| isLimitedUpToDepartmentScope
	|| isLimitedUpToGlobalScope

	return isPermitted && !props.modelValue.value.deletedAt
})
const mayViewComment = computed<boolean>(() => {
	const user = props.modelValue.user as DeserializedUserDocument<"department">
	const isLimitedPersonalScope = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
		ARCHIVE_AND_RESTORE_PERSONAL_COMMENT_ON_OWN_DEPARTMENT
	]) && user.data.id === userProfile.data.id

	const departmentID = user.data.department.data.id
	const isLimitedUpToDepartmentScope = !isLimitedPersonalScope
		&& permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			ARCHIVE_AND_RESTORE_SOCIAL_COMMENT_ON_OWN_DEPARTMENT
		]) && user.data.department.data.id === departmentID

	const isLimitedUpToGlobalScope = !isLimitedUpToDepartmentScope
		&& permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			ARCHIVE_AND_RESTORE_PUBLIC_COMMENT_ON_ANY_DEPARTMENT
		])

	const isPermitted = isLimitedPersonalScope
	|| isLimitedUpToDepartmentScope
	|| isLimitedUpToGlobalScope

	const isDeleted = props.modelValue.value.deletedAt
	const mayViewArchived = isPermitted && isDeleted
	const mayViewPresent = !isDeleted

	return mayViewArchived || mayViewPresent
})

const mayVote = computed<boolean>(() => {
	const hasNotLoaded = isUndefined(props.modelValue.meta)

	return !hasNotLoaded && mayVoteComment.value && hasRenewedVote.value
})

const voteCount = computed<number>(() => {
	if (isUndefined(props.modelValue.meta)) return 0
	return props.modelValue.meta.upvoteCount - props.modelValue.meta.downvoteCount
})

const friendlyVoteCount = computed<string>(() => `${voteCount.value} votes`)

const comment = ref<DeserializedCommentResource<"user">>(props.modelValue)

const vote = computed<CompleteVoteKind>({
	get(): CompleteVoteKind {
		if (isUndefined(props.modelValue.meta)) {
			return "abstain"
		}

		return props.modelValue.meta.currentUserVoteStatus
	},
	set(newValue: CompleteVoteKind): void {
		if (!isUndefined(props.modelValue.meta)) {
			const oldValue = props.modelValue.meta.currentUserVoteStatus
			const commentWithVote = {
				...props.modelValue,
				"meta": {
					...props.modelValue.meta
				}
			}

			commentWithVote.meta.currentUserVoteStatus = newValue
			if (oldValue === "upvote") commentWithVote.meta.upvoteCount--
			else if (oldValue === "downvote") commentWithVote.meta.downvoteCount--

			if (newValue === "upvote") commentWithVote.meta.upvoteCount++
			else if (newValue === "downvote") commentWithVote.meta.downvoteCount++

			emit("update:modelValue", commentWithVote)
		}
	}
})

const voteID = computed<string|null>({
	get(): string|null {
		return props.modelValue.meta?.commentVoteID ?? null
	},
	set(newValue: string|null): void {
		if (!isUndefined(props.modelValue.meta)) {
			const commentWithVote = {
				...props.modelValue,
				"meta": {
					...props.modelValue.meta
				}
			}

			commentWithVote.meta.commentVoteID = newValue
			emit("update:modelValue", commentWithVote)
		}
	}
})

const friendlyCommentTimestamp = computed<string>(() => {
	const { createdAt } = comment.value

	return formatToFriendlyPastTime(createdAt)
})

const completeFriendlyCommentTimestamp = computed<string>(() => {
	const { createdAt, updatedAt } = comment.value
	const friendlyCreationTime = formatToCompleteFriendlyTime(createdAt)
	const friendlyModificationTime = formatToCompleteFriendlyTime(updatedAt)

	return `Created at: ${friendlyCreationTime}\nUpdated at: ${friendlyModificationTime}`
})

async function switchVote(newRawVote: string): Promise<void> {
	const newVote = newRawVote as CompleteVoteKind
	const currentVote = vote.value
	hasRenewedVote.value = false

	if (currentVote === "abstain" && newVote !== "abstain") {
		await voteFetcher.create({
			"kind": newVote
		}, {
			"extraDataFields": {
				"relationships": {
					"comment": {
						"data": {
							"id": comment.value.id,
							"type": "comment"
						}
					},
					"user": {
						"data": {
							"id": userProfile.data.id,
							"type": "user"
						}
					}
				}
			}
		}).then(({ body }) => {
			voteID.value = body.data.id
			return nextTick()
		}).then(() => {
			vote.value = newVote
		})
	} else if (newVote === "abstain") {
		await voteFetcher.archive([ voteID.value as string ]).then(() => {
			vote.value = newVote
		})
	} else {
		await voteFetcher.update(voteID.value as string, {
			"kind": newVote
		}).then(() => {
			vote.value = newVote
		})
	}

	hasRenewedVote.value = true
}

const {
	"state": mustUpdate,
	"off": closeUpdateField,
	"on": openUpdateField
} = makeSwitch(false)
const mustDisplayOnly = computed(() => !mustUpdate.value && !mayViewComment.value)
function closeUpdateCommentField(newComment: DeserializedCommentResource<"user">) {
	emit("update:modelValue", newComment)
	comment.value = newComment
	closeUpdateField()
}


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

async function archiveComment(): Promise<void> {
	await fetcher.archive([ comment.value.id ]).then(() => {
		emit("archive", comment.value)
	})
}

async function restoreComment(): Promise<void> {
	await fetcher.restore([ comment.value.id ]).then(() => {
		emit("restore", comment.value)
	})
}
</script>
