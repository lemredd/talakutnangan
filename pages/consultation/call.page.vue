<template>
	<div class="call">
		<div class="participants">
			<SelfParticipant
				v-model:must-show-video="isShowingVideo"
				v-model:must-transmit-audio="isTransmittingAudio"
				:is-joined="isJoined"
				:container-id="selfParticipantID"
				class="local-participant"/>
			<OtherParticipantsContainer
				class="other-participants"
				:other-participants="uniqueOtherParticipants as RemoteTracks[]"/>
		</div>

		<Suspensible
			class="suspensive-call-controls"
			:is-loaded="isReadyForCalling"
			custom-message="Please wait. we are still preparing you for call...">
			<CallControls
				v-model:is-joined="isJoined"
				:is-showing-video="isShowingVideo"
				:is-transmitting-audio="isTransmittingAudio"
				@toggle-video="toggleVideo"
				@toggle-mic="toggleMic"
				@join-call="join"
				@leave-call="leave"/>
		</Suspensible>
	</div>
</template>

<style scoped lang="scss">
	.participants{
		@apply flex flex-col;
		position: relative;

		@screen sm {
			@apply flex-row;
		}

		.local-participant {
			overflow: hidden;
		}

		.other-participants {
			@apply flex-1;
		}
	}

	.suspensive-call-controls {
		@apply border-t py-4 bg-white;
		@apply dark:bg-dark-400;
		position: fixed;
		bottom: 0;
		width: 100%;

		text-align: center;
	}
</style>

<script setup lang="ts">
import {
	computed,
	inject,
	onMounted,
	onBeforeUnmount,
	Ref,
	ref
} from "vue"

import type { PageContext } from "$/types/renderer"
import type { StatusMessage } from "$/types/message"
import type { RemoteTracks } from "@/consultation/call/helpers/types/video_conference_manager"
import type { ChatMessageRelationships } from "$/types/documents/chat_message"
import type {
	DeserializedChatMessageActivityResource,
	DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"

import makeUniqueBy from "$/helpers/make_unique_by"
import isUndefined from "$/type_guards/is_undefined"

import Fetcher from "$@/fetchers/consultation"
import makeSwitch from "$@/helpers/make_switch"
import ChatMessageFetcher from "$@/fetchers/chat_message"

import Suspensible from "@/helpers/suspensible.vue"
import CallControls from "@/consultation/call/call_controls.vue"
import SelfParticipant from "@/consultation/call/self_participant.vue"
import OtherParticipantsContainer from "@/consultation/call/other_participants.vue"
import {
	initiateVideoConferenceEngine,
	joinAndPresentLocalTracks,
	leaveAndRemoveLocalTracks
} from "@/consultation/call/helpers/video_conference_manager"

type AdditionalPageProps = "VIDEO_CONFERENCE_APP_ID"|"chatMessageActivities"|"consultation"
const pageContext = inject("pageContext") as PageContext<"deserialized", AdditionalPageProps>
const { pageProps } = pageContext
const { consultation, userProfile, VIDEO_CONFERENCE_APP_ID } = pageProps

const chatMessageActivities = ref<
	DeserializedChatMessageActivityListDocument<"user"|"consultation">
>(
	pageProps.chatMessageActivities as DeserializedChatMessageActivityListDocument<
		"user"|"consultation"
	>
)

const currentConsultationActivity = computed<
	DeserializedChatMessageActivityResource<"user"|"consultation">[]
>(() => {
	const foundChatActivity = chatMessageActivities.value.data.filter(activity => {
		const consultationID = activity.consultation.data.id
		return String(consultationID) === String(consultation.data.id)
	}) as DeserializedChatMessageActivityResource<"user"|"consultation">[]

	return foundChatActivity
})

const ownCurrentConsultationActivityResource = computed<
	DeserializedChatMessageActivityResource<"user"|"consultation">
>(() => {
	const foundChatActivity = currentConsultationActivity.value.find(activity => {
		const ownerID = activity.user.data.id
		return String(ownerID) === String(userProfile.data.id)
	})

	if (isUndefined(foundChatActivity)) {
		throw new Error("Chat message activity of the current user was not found.")
	}

	return foundChatActivity
})

const fetcher = new Fetcher()
const chatMessageFetcher = new ChatMessageFetcher()

const token = ref("")
const { "id": consultationID } = consultation.data
const { "id": chatMessageActivityID } = ownCurrentConsultationActivityResource.value
const channelName = `call_${consultationID}`
function fetchGeneratedToken() {
	// TODO: make channel name unique based on consultation ID
	fetcher.generateToken(consultationID, channelName, chatMessageActivityID)
	.then(({ body }) => {
		const { meta } = body
		const { RTCToken } = meta

		token.value = RTCToken
	})
}

function sendMessage(message: string) {
	chatMessageFetcher.create({
		"createdAt": new Date().toJSON(),
		"data": {
			"value": message
		},
		"kind": "status",
		"updatedAt": new Date().toJSON()
	} as StatusMessage, {
		"extraDataFields": {
			"relationships": {
				"chatMessageActivity": {
					"data": {
						"id": chatMessageActivityID,
						"type": "chat_message_activity"
					}
				}
			}
		} as ChatMessageRelationships
	})
}

const {
	"toggle": toggleVideo,
	"state": isShowingVideo
} = makeSwitch(true)
const {
	"toggle": toggleMic,
	"state": isTransmittingAudio
} = makeSwitch(true)
const {
	"off": leaveAndHideAdditionalButtons,
	"on": joinAndShowAdditionalButtons,
	"state": isJoined
} = makeSwitch(false)
const selfParticipantID = `local-${chatMessageActivityID}`
function join() {
	joinAndShowAdditionalButtons()
	joinAndPresentLocalTracks(
		VIDEO_CONFERENCE_APP_ID as string,
		channelName,
		chatMessageActivityID,
		selfParticipantID,
		token.value,
		{
			"isShowingVideo": isShowingVideo.value,
			"isTransmittingAudio": isTransmittingAudio.value
		}
	)
	sendMessage(`${userProfile.data.name} joined the call`)
}
function leave() {
	leaveAndHideAdditionalButtons()
	leaveAndRemoveLocalTracks()
	sendMessage(`${userProfile.data.name} leaved the call`)
}

const otherParticipants = ref<RemoteTracks[]>([])
const uniqueOtherParticipants = computed(() => makeUniqueBy(otherParticipants.value, "remoteID"))

const isReadyForCalling = ref(false)
onMounted(() => {
	fetchGeneratedToken()
	initiateVideoConferenceEngine(otherParticipants as Ref<RemoteTracks[]>)
	.then(() => {
		isReadyForCalling.value = true
	}).then(() => sendMessage(`${userProfile.data.name} preparing for call`))
})
onBeforeUnmount(() => {
	sendMessage(`${userProfile.data.name} completely exited from call`)
})
</script>
