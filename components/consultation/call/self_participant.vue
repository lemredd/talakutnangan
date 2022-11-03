<template>
	<div :id="selfParticipantId" class="self-participant">
		<div v-if="!mustShowVideo" class="profile-user">
			<ProfilePicture
				class="profile-picture"
				:user="userProfile"/>
		</div>
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
			position: absolute;
			max-width:100px;
			max-height:100px;
		}

		.video-track {
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

watch(props, () => {
	if (props.mustShowVideo) {
		console.log("agora should be working")
	}
	if (props.mustTransmitAudio) {
		console.log("agora should be working")
	}
	if (!props.mustShowVideo) console.log("agfora should be working")
	if (!props.mustTransmitAudio) console.log("agfora should be working")
})
</script>
