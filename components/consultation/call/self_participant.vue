<template>
	<div :id="selfParticipantId" class="self-participant">
		<video ref="videoElement"></video>
	</div>
</template>

<style scoped lang="scss">
	video {
		width: 100%;
		height: 100%;
	}
</style>

<script setup lang="ts">
import { inject, ref, watch } from "vue"

import type { PageContext } from "$/types/renderer"

type AdditionalPageProps = "consultation"|"chatMessageActivities"
const pageContext = inject("pageContext") as PageContext<"deserialized", AdditionalPageProps>
const { pageProps } = pageContext
const { userProfile } = pageProps

type DefinedProps = {
	mustShowVideo: boolean
	mustTransmitAudio: boolean
}
const props = defineProps<DefinedProps>()

const selfParticipantId = `${userProfile.data.id}_${userProfile.data.name}`
const videoElement = ref<HTMLVideoElement|null>(null)

function addVideoStream(stream: MediaStream) {
	const video = videoElement.value as HTMLVideoElement
	video.srcObject = stream
	video.autoplay = true
	video.addEventListener("loadedmetadata", () => video.play())
}

function removeVideoStream(video: HTMLVideoElement) {
	video.srcObject = null
}

watch(props, () => {
	if (props.mustShowVideo) {
		navigator.mediaDevices.getUserMedia({ "video": true })
		.then(addVideoStream)
	}
})
</script>
