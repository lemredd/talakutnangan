<template>
	<div class="call">
		<div class="participants">
			<SelfParticipant
				ref="localPlayerContainer"
				v-model:must-show-video="mustShowVideo"
				v-model:must-transmit-audio="mustTransmitAudio"
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

		<CallControls
			@toggle-video="toggleVideo"
			@toggle-mic="toggleMic"/>
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
</style>

<script setup lang="ts">
import { computed, inject, onMounted, provide, ref, watch } from "vue"

import type {
	IAgoraRTC,
	IAgoraRTCClient,
	ILocalAudioTrack,
	ILocalVideoTrack
} from "agora-rtc-sdk-ng"
import { PageContext } from "$/types/renderer"
import type {
	DeserializedChatMessageActivityResource,
	DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"

import { CURRENT_USER_RTC_TOKEN } from "$@/constants/provided_keys"

import isUndefined from "$/type_guards/is_undefined"

import makeSwitch from "$@/helpers/make_switch"
import Fetcher from "$@/fetchers/consultation"

import CallControls from "@/consultation/call/call_controls.vue"
import SelfParticipant from "@/consultation/call/self_participant.vue"

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
provide(CURRENT_USER_RTC_TOKEN, token)
function fetchGeneratedToken() {
	fetcher.generateToken(consultationID, "call", chatMessageActivityID)
	.then(({ body }) => {
		const { meta } = body
		const { RTCToken } = meta

		token.value = RTCToken
	})
}

let AgoraRTC: IAgoraRTC|null = null
let videoConferenceEngine: IAgoraRTCClient|null = null
async function initiateVideConferenceEngine() {
	if (!isUndefined(window)) {
		// @ts-ignore
		AgoraRTC = await import("agora-rtc-sdk-ng") as IAgoraRTC
		videoConferenceEngine = AgoraRTC.createClient({
			"codec": "vp8",
			"mode": "rtc"
		})
	}
}
const localPlayerContainer = ref<HTMLDivElement|null>(null)

type LocalTracks = {
	"localAudioTrack": ILocalAudioTrack|null
	"localVideoTrack": ILocalVideoTrack|null
}
const localTracks: LocalTracks = {
	"localAudioTrack": null,
	"localVideoTrack": null
}
const {
	"toggle": toggleVideo,
	"state": mustShowVideo
} = makeSwitch(false)
const {
	"toggle": toggleMic,
	"state": mustTransmitAudio
} = makeSwitch(false)

onMounted(() => {
	fetchGeneratedToken()
	initiateVideConferenceEngine()
})

watch(mustShowVideo, async() => {
	if (mustShowVideo.value) {
		videoConferenceEngine = videoConferenceEngine as IAgoraRTCClient
		AgoraRTC = AgoraRTC as IAgoraRTC
		await videoConferenceEngine.join(
			VIDEO_CONFERENCE_APP_ID as string,
			"call",
			token.value,
			chatMessageActivityID
		)
		localTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
		localTracks.localVideoTrack = await AgoraRTC.createCameraVideoTrack()

		await videoConferenceEngine.publish([
			localTracks.localAudioTrack,
			localTracks.localVideoTrack
		])
		localTracks.localVideoTrack.play(localPlayerContainer.value as HTMLDivElement)
	}
})
</script>
