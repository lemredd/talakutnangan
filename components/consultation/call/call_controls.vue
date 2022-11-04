<template>
	<div class="call-controls">
		<div v-if="isJoined" class="user-joined-controls">
			<CallControl
				class="toggle-video"
				title="Toggle Video"
				material-icon="videocam"
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

type CustomEvents = {
	(event: "toggleVideo", newValue: boolean): void
	(event: "toggleMic", newValue: boolean): void
	(event: "joinCall"): void
	(event: "leaveCall"): void
}
const emit = defineEmits<CustomEvents>()
const props = defineProps<{
	isJoined: boolean
	mustShowVideo: boolean
	mustTransmitAudio: boolean
}>()

const mustShowVideo = computed({
	"get": () => props.mustShowVideo,
	set(newValue: boolean): void {
		emit("toggleVideo", newValue)
	}
})

const mustTransmitAudio = computed({
	"get": () => props.mustTransmitAudio,
	set(newValue: boolean): void {
		emit("toggleMic", newValue)
	}
})

function toggleVideo() {
	mustShowVideo.value = !mustShowVideo.value
}
function toggleMic() {
	mustTransmitAudio.value = !mustTransmitAudio.value
}
function joinCall() {
	emit("joinCall")
}
function leaveCall() {
	emit("leaveCall")
}
</script>
