<template>
	<div class="self-participant" :id="selfParticipantId">
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
import { inject, onMounted, ref } from "vue"

import type { PageContext } from "$/types/renderer"

type AdditionalPageProps = "consultation"|"chatMessageActivities"
const pageContext = inject("pageContext") as PageContext<"deserialized", AdditionalPageProps>
const { pageProps } = pageContext
const { userProfile } = pageProps

const selfParticipantId = `${userProfile.data.id}_${userProfile.data.name}`
const videoElement = ref<HTMLVideoElement|null>(null)

function addVideoStream(video: HTMLVideoElement, stream: MediaStream) {
	video.srcObject = stream
	video.autoplay = true
	video.addEventListener("loadedmetadata", () => video.play())
}

onMounted(() => {
	navigator.mediaDevices.getUserMedia({ "video": true })
	.then(stream => addVideoStream(
		videoElement.value as HTMLVideoElement,
		stream
	))
})
</script>
