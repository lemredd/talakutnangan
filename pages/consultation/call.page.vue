<template>
	<div class="call">
		<div class="participants">
			<SelfParticipant
				v-model:must-show-video="mustShowVideo"
				v-model:must-transmit-audio="mustTransmitAudio"
				:container-id="selfParticipantID"
				class="local-participant"/>
			<div class="others">
				<!-- TODO: Use remote participant -->
				<!-- <SelfParticipant
					v-model:must-show-video="mustShowVideo"
					v-model:must-transmit-audio="mustTransmitAudio"
					class="other-participant"/>
				<SelfParticipant
					v-model:must-show-video="mustShowVideo"
					v-model:must-transmit-audio="mustTransmitAudio"
					class="other-participant"/>
				<SelfParticipant
					v-model:must-show-video="mustShowVideo"
					v-model:must-transmit-audio="mustTransmitAudio"
					class="other-participant"/>
				<SelfParticipant
					v-model:must-show-video="mustShowVideo"
					v-model:must-transmit-audio="mustTransmitAudio"
					class="other-participant"/> -->
			</div>
		</div>

		<Suspensible
			class="suspensive-call-controls"
			:is-loaded="isReadyForCalling"
			custom-message="Please wait. we are still preparing you for call...">
			<CallControls
				v-model:is-joined="isJoined"
				@join-call="join"
				@leave-call="leave"
				@toggle-video="toggleVideo"
				@toggle-mic="toggleMic"/>
		</Suspensible>
	</div>
</template>

<style scoped lang="scss">
	.participants{
		@apply flex flex-col;

		.others{
			@apply flex flex-col;
			@screen sm{
				@apply flex-row;
			}

			.other-participant{
				width:100%;
			}
		}

		.local-participant{
			@apply flex-1;
		}
	}

	.suspensive-call-controls {
		@apply border-t py-4;
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
	provide,
	readonly,
	ref
} from "vue"

import type { PageContext } from "$/types/renderer"
import type {
	DeserializedChatMessageActivityResource,
	DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"

import { CURRENT_USER_RTC_TOKEN } from "$@/constants/provided_keys"

import isUndefined from "$/type_guards/is_undefined"

import makeSwitch from "$@/helpers/make_switch"
import Fetcher from "$@/fetchers/consultation"

import Suspensible from "@/helpers/suspensible.vue"
import CallControls from "@/consultation/call/call_controls.vue"
import SelfParticipant from "@/consultation/call/self_participant.vue"
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
const token = ref("")
const { "id": consultationID } = consultation.data
const { "id": chatMessageActivityID } = ownCurrentConsultationActivityResource.value
const channelName = `call_${consultationID}`
provide(CURRENT_USER_RTC_TOKEN, readonly(token))
function fetchGeneratedToken() {
	// TODO: make channel name unique based on consultation ID
	fetcher.generateToken(consultationID, channelName, chatMessageActivityID)
	.then(({ body }) => {
		const { meta } = body
		const { RTCToken } = meta

		token.value = RTCToken
	})
}

const {
	"toggle": toggleVideo,
	"state": mustShowVideo
} = makeSwitch(false)
const {
	"toggle": toggleMic,
	"state": mustTransmitAudio
} = makeSwitch(false)
const {
	"off": leaveAndHideAdditionalButtons,
	"on": joinAndShowAdditionalButtons,
	"state": isJoined
} = makeSwitch(false)
const selfParticipantID = `local-${chatMessageActivityID}`
function join() {
	toggleVideo()
	joinAndShowAdditionalButtons()
	joinAndPresentLocalTracks(
		VIDEO_CONFERENCE_APP_ID as string,
		channelName,
		chatMessageActivityID,
		selfParticipantID,
		token.value
	)
}
function leave() {
	leaveAndHideAdditionalButtons()
	leaveAndRemoveLocalTracks()
}

const isReadyForCalling = ref(false)
onMounted(() => {
	fetchGeneratedToken()
	initiateVideoConferenceEngine()
	.then(() => {
		isReadyForCalling.value = true
	})
})
</script>
