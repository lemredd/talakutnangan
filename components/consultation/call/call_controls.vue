<template>
	<div class="call-controls">
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
</template>

<style scoped lang="scss">
.call-controls {
	@apply border-t py-4;
	@apply flex justify-center;

	position: fixed;
	bottom: 0;
	width: 100%;
}
</style>

<script setup lang="ts">
import CallControl from "@/consultation/call/call_controls/call_control.vue"

type CustomEvents = {
	(event: "toggleVideo"): void
	(event: "toggleMic"): void
	(event: "leaveCall"): void
}
const emit = defineEmits<CustomEvents>()

function toggleVideo() {
	emit("toggleVideo")
}
function toggleMic() {
	emit("toggleMic")
}
function leaveCall() {
	emit("leaveCall")
}
</script>
