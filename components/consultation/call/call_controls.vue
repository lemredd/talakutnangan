<template>
	<div class="call-controls">
		<div v-if="isJoined" class="user-joined-controls">
			<CallControl
				class="toggle-video"
				title="Toggle Video"
				:material-icon="videoIcon"
				@click="toggleVideo"/>
			<CallControl
				class="toggle-mic"
				title="Toggle Audio"
				material-icon="mic"
				@click="toggleMic"/>
			<CallControl
				class="leave-call"
				title="Leave Call"
				material-icon="call_end"
				@click="leaveCall"/>
		</div>

		<button
			v-else
			class="join-call-btn btn btn-primary"
			@click="joinCall">
			join call
		</button>
	</div>
</template>

<style scoped lang="scss">
	@import "@styles/btn.scss";

	.call-controls {
		@apply border-t py-4;
		@apply flex justify-center;
		@apply bg-white dark:bg-dark-400;

		position: fixed;
		bottom: 0;
		width: 100%;
	}
</style>

<script setup lang="ts">
import { computed } from "vue"

import CallControl from "@/consultation/call/call_controls/call_control.vue"
import {
	muteVideoTrack,
	unmuteVideoTrack
} from "@/consultation/call/helpers/video_conference_manager"

type CustomEvents = {
	(event: "toggleVideo"): void
	(event: "toggleMic"): void
	(event: "joinCall"): void
	(event: "leaveCall"): void
}
const emit = defineEmits<CustomEvents>()
const props = defineProps<{
	isJoined: boolean
	mustShowVideo: boolean
	mustTransmitAudio: boolean
}>()

const videoIcon = computed(() => {
	let icon = ""
	if (props.mustShowVideo) icon = "videocam"
	else icon = "videocam_off"

	return icon
})
function toggleVideo() {
	if (props.mustShowVideo) muteVideoTrack()
	else unmuteVideoTrack()

	emit("toggleVideo")
}
function toggleMic() {
	emit("toggleMic")
}
function joinCall() {
	emit("joinCall")
}
function leaveCall() {
	emit("leaveCall")
}
</script>
