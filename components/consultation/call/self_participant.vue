<template>
	<div :id="selfParticipantId" class="self-participant">
		<div class="profile-user">
			<ProfilePicture
				class="profile-picture w-50 h-50 mb-50"
				:user="userProfile"/>
		</div>
		<video
			v-if="mustShowVideo"
			ref="videoElement"
			class="video-track"></video>
		<audio ref="audioElement"></audio>
	</div>
</template>

<style scoped lang="scss">
	.name-user{
		@apply flex justify-center  mb-5;
	}
	.call-details{
		@apply flex justify-center mb-20;
	}
	.profile-user{
		@apply flex justify-center;
	}

	.self-participant{
		position:relative;
	}
	video {
		position: absolute;
		top: 0;
		left: 0;

		max-width:100%;
		max-height:100%;
		width: 100%;
		height: 100%;
	}
</style>

<script setup lang="ts">
import { inject, ref, watch } from "vue"

import type { PageContext } from "$/types/renderer"
import ProfilePicture from "@/consultation/list/profile_picture_item.vue"

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
function removeVideoStream() {
	const video = videoElement.value as HTMLVideoElement
	video.srcObject = null
}

const audioElement = ref<HTMLAudioElement|null>(null)
function addAudioStream(stream: MediaStream) {
	const audio = audioElement.value as HTMLAudioElement
	audio.srcObject = stream
	audio.autoplay = true
	audio.addEventListener("loadedmetadata", () => audio.play())
}
function removeAudioStream() {
	const audio = audioElement.value as HTMLAudioElement
	audio.srcObject = null
}

watch(props, () => {
	if (props.mustShowVideo) {
		navigator.mediaDevices.getUserMedia({ "video": true })
		.then(addVideoStream)
	}
	if (props.mustTransmitAudio) {
		navigator.mediaDevices.getUserMedia({ "audio": true })
		.then(addAudioStream)
	}
	if (!props.mustShowVideo) removeVideoStream()
	if (!props.mustTransmitAudio) removeAudioStream()
})
</script>
