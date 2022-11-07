<template>
	<div :id="selfParticipantId" class="self-participant">
		<div v-if="!mustShowVideo" class="profile-user">
			<ProfilePicture
				class="profile-picture"
				:user="userProfile"/>
		</div>
		<div
			:id="containerId"
			class="track-container">
			<video
				v-if="!isJoined && mustShowVideo"
				ref="previewVideo"
				class="preview-video">
			</video>
		</div>
	</div>
</template>

<style scoped lang="scss">
	$occupyHeight: calc(100vh - 80px);
	.self-participant{
		@apply m-2;
		@apply flex justify-center items-center;
		@apply bg-black;
		position:relative;

		max-height: $occupyHeight;
		height: 100%;
		min-height:300px;

		.profile-user{
			position: absolute;
			max-width:100px;
			max-height:100px;
			z-index: 999;
		}

		.track-container {
			width: 100%;
			height: 100%;
			min-height: $occupyHeight;
			position: absolute;

			.preview-video {
				@apply object-cover;
				height: 100%;
			}
		}
	}

	@screen sm {
		.self-participant {
			@apply mr-1;
			min-height: $occupyHeight;
			width: 60vw;
		}
	}
</style>

<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from "vue"

import type { PageContext } from "$/types/renderer"
import ProfilePicture from "@/consultation/list/profile_picture_item.vue"

type AdditionalPageProps = "consultation"|"chatMessageActivities"
const pageContext = inject("pageContext") as PageContext<"deserialized", AdditionalPageProps>
const { pageProps } = pageContext
const { userProfile } = pageProps

type DefinedProps = {
	containerId: string
	isJoined: boolean
	mustShowVideo: boolean
	mustTransmitAudio: boolean
}
const props = defineProps<DefinedProps>()

const selfParticipantId = `${userProfile.data.id}_${userProfile.data.name}`
const previewVideo = ref<HTMLVideoElement|null>(null)
const mustShowVideo = computed(() => props.mustShowVideo)
function previewVideoTrack() {
	if (navigator.mediaDevices) {
		navigator.mediaDevices.getUserMedia({ "video": true })
		.then(stream => {
			const videoElement = previewVideo.value as HTMLVideoElement
			videoElement.srcObject = stream
			videoElement.autoplay = true
			videoElement.addEventListener("loadedmetadata", () => videoElement.play())
		})
	} else {
		// @ts-ignore
		navigator.getUserMedia({ "video": true })
		.then((stream: MediaStream) => {
			const videoElement = previewVideo.value as HTMLVideoElement
			videoElement.srcObject = stream
			videoElement.autoplay = true
			videoElement.addEventListener("loadedmetadata", () => videoElement.play())
		})
	}
}

watch(mustShowVideo, () => {
	if (mustShowVideo.value) previewVideoTrack()
})
onMounted(() => {
	if (mustShowVideo.value) previewVideoTrack()
})
</script>
