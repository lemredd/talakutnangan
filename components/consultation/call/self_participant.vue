<template>
	<div :id="selfParticipantId" class="self-participant">
		<div v-if="!mustShowVideo" class="profile-user">
			<ProfilePicture
				class="profile-picture"
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
	.self-participant{
		@apply m-2;
		@apply flex justify-center items-center;
		@apply bg-blue-gray-300 bg-opacity-60;
		position:relative;

		max-height:600px;
		min-height:300px;

		.profile-user{
			max-width:100px;
			max-height:100px;
		}

		video {
			@apply object-cover;
			max-width:800px;
			max-height:100%;
			width: 100%;
			height: 100%;
		}
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
