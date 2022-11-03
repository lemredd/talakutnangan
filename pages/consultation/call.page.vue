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
					class="other-participant"/>
				<SelfParticipant
					v-model:must-show-video="mustShowVideo"
					v-model:must-transmit-audio="mustTransmitAudio"
					class="other-participant"/>
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
import AgoraRTC from "agora-rtc-sdk-ng"
import { computed, inject, onMounted, provide, ref } from "vue"

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
const { consultation, userProfile } = pageProps

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

const {
	"toggle": toggleVideo,
	"state": mustShowVideo
} = makeSwitch(false)
const {
	"toggle": toggleMic,
	"state": mustTransmitAudio
} = makeSwitch(false)

const fetcher = new Fetcher()
const token = ref("")
provide(CURRENT_USER_RTC_TOKEN, token)
function fetchGeneratedToken() {
	const { "id": consultationID } = consultation.data
	const { "id": chatMessageActivityID } = ownCurrentConsultationActivityResource.value
	fetcher.generateToken(consultationID, "call", chatMessageActivityID)
	.then(({ body }) => {
		const { meta } = body
		const { RTCToken } = meta

		token.value = RTCToken
	})
}

const agoraEngine = AgoraRTC.createClient({
	"codec": "vp8",
	"mode": "rtc"
})
const localPlayerContainer = ref<HTMLDivElement|null>(null)

onMounted(() => {
	fetchGeneratedToken()
})
</script>
