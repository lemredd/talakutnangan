<template>
	<div v-if="isConnected" class="call">
		<SelfParticipant
			v-model:must-show-video="mustShowVideo"
			v-model:must-transmit-audio="mustTransmitAudio"
			@stream-video="streamVideo"/>

		<div
			v-for="(stream, i) in otherStreams"
			:key="i"
			class="others">
			<video :srcObject="stream"></video>
		</div>

		<CallControls
			@toggle-video="toggleVideo"
			@toggle-mic="toggleMic"/>
	</div>
</template>

<style>
</style>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type {
	ChatMessageActivityResourceIdentifier,
	DeserializedChatMessageActivityResource,
	DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"
import type {
	DeserializedConsultationResource
} from "$/types/documents/consultation"


import Peer from "$@/external/peer"
import Socket from "$@/external/socket"

import makeSwitch from "$@/helpers/make_switch"
import isUndefined from "$/type_guards/is_undefined"
import makeConsultationCallNamespace from "$/namespace_makers/consultation_call"


import CallControls from "@/consultation/call/call_controls.vue"
import SelfParticipant from "@/consultation/call/self_participant.vue"
import registerCallListeners from "@/consultation/call/helpers/register_call"

Socket.initialize()

type AdditionalPageProps = "mustUsePeerServer"|"chatMessageActivities"|"consultation"
const pageContext = inject("pageContext") as PageContext<"deserialized", AdditionalPageProps>
const { pageProps } = pageContext

const { userProfile } = pageProps

const consultation = ref<DeserializedConsultationResource<"consultant"|"consultantRole">>(
	pageProps.consultation.data as DeserializedConsultationResource<"consultant"|"consultantRole">
)

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
		return String(consultationID) === String(consultation.value.id)
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

const receivedPeerIDs = ref<ChatMessageActivityResourceIdentifier[]>(
	currentConsultationActivity.value.map(
		activity => ({
			"id": activity.id,
			"type": "chat_message_activity"
		})
	)
)

const otherStreams = ref<MediaStream[]>([])

const {
	"toggle": toggleVideo,
	"state": mustShowVideo
} = makeSwitch(false)
const {
	"toggle": toggleMic,
	"state": mustTransmitAudio
} = makeSwitch(false)
const {
	"toggle": toggleConnection,
	"state": isConnected
} = makeSwitch(true)

function streamVideo(stream: MediaStream) {
	Peer.initialize(
		peerID => {
			const ownID = ownCurrentConsultationActivityResource.value.id
			const resource = chatMessageActivities.value.data.find(
				activity => activity.id === ownID
			) as DeserializedChatMessageActivityResource

			resource.meta = {
				peerID
			}

			const callNamespace = makeConsultationCallNamespace(consultation.value.id)
			Socket.send(callNamespace, "send_peer_id", peerID)
		},
		stream,
		otherStream => {
			otherStreams.value.push(otherStream)
		}
	)
}
onMounted(() => {
	registerCallListeners(
		consultation,
		receivedPeerIDs
	)
})
</script>
