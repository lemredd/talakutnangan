<template>
	<div class="call">
		<div class="participants">
			<SelfParticipant
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
import { inject } from "vue"

import { PageContext } from "$/types/renderer"

import makeSwitch from "$@/helpers/make_switch"

import CallControls from "@/consultation/call/call_controls.vue"
import SelfParticipant from "@/consultation/call/self_participant.vue"

type AdditionalPageProps = "mustUsePeerServer"|"chatMessageActivities"|"consultation"
const pageContext = inject("pageContext") as PageContext<"deserialized", AdditionalPageProps>


const {
	"toggle": toggleVideo,
	"state": mustShowVideo
} = makeSwitch(false)
const {
	"toggle": toggleMic,
	"state": mustTransmitAudio
} = makeSwitch(false)
</script>
