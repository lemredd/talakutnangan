<template>
	<section v-if="mustDisplayOnly" class="flex flex-col flex-nowrap">
		<header class="flex-1 flex flex-row flex-nowrap">
			<ProfilePicture
				class="flex-initial w-auto h-12"
				:user="comment.user"/>
			<h3 class="flex-1 m-auto ml-2">
				{{ comment.user.data.name }}
			</h3>
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
						@click="archivePost">
						Archive comment
					</button>
					<button
						v-if="mustRestore"
						class="btn submit-btn btn-primary"
						type="button"
						@click="restorePost">
						Restore comment
					</button>
				</template>
			</Overlay>
		</header>
		<p class="flex-1 indent mt-4">
			{{ comment.content }}
		</p>
		<div class="comment-container">
			<div class="right">
				<SelectableVote
					:model-value="vote"
					title=""
					:options="voteOptions"
					@update:model-value="switchVote"/>
				<h2 class="title">
					{{ voteCount }} votes
				</h2>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
	@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { ref, computed, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { OptionInfo } from "$@/types/component"
import type { DeserializedCommentResource, CompleteVoteKind } from "$/types/documents/comment"

import Fetcher from "$@/fetchers/comment"
import makeSwitch from "$@/helpers/make_switch"
import isUndefined from "$/type_guards/is_undefined"

import Overlay from "@/helpers/overlay.vue"
import VoteFetcher from "$@/fetchers/comment_vote"
import Menu from "@/comment/multiviewer/viewer/menu.vue"
import SelectableVote from "@/fields/selectable_checkbox.vue"
import ProfilePicture from "@/consultation/list/profile_picture_item.vue"

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

const voteCount = ref<number>(0)
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
			const commentWithVote = {
				...props.modelValue,
				"meta": {
					...props.modelValue.meta
				}
			}

			commentWithVote.meta.currentUserVoteStatus = newValue
			emit("update:modelValue", commentWithVote)

			voteCount.value = Number(
				Number(commentWithVote.meta.upvoteCount))
			- Number(commentWithVote.meta.downvoteCount)
		}
	}
})

const voteOptions = [
	{
		"value": "upvote"
	},
	{
		"value": "downvote"
	}
] as OptionInfo[]

async function switchVote(newRawVote: string): Promise<void> {
	const newVote = newRawVote as CompleteVoteKind
	const currentVote = vote.value

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
		}).then(() => {
			vote.value = newVote
		})
	} else if (newVote === "abstain") {
		// TODO: use real comment vote ID
		await voteFetcher.archive([ comment.value.meta?.commentVoteID ?? "" ]).then(() => {
			vote.value = newVote
		})
	} else {
		// TODO: use real comment vote ID
		await voteFetcher.update(comment.value.meta?.commentVoteID ?? "", {
			"kind": newVote
		}).then(() => {
			vote.value = newVote
		})
	}
}

const {
	"state": mustUpdate,
	"on": openUpdateField
} = makeSwitch(false)
const mustDisplayOnly = computed(() => !mustUpdate.value)

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

async function submitChangesSeparately(): Promise<void> {
	await fetcher.update(comment.value.id, {
		"content": comment.value.content,
		"deletedAt": null
	}).then(() => {
		emit("update:modelValue", comment.value)
	})
}

async function archivePost(): Promise<void> {
	await fetcher.archive([ comment.value.id ]).then(() => {
		emit("archive", comment.value)
	})
}

async function restorePost(): Promise<void> {
	await fetcher.restore([ comment.value.id ]).then(() => {
		emit("restore", comment.value)
	})
}
</script>
