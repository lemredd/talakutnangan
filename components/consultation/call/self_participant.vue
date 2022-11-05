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
		</div>
	</div>
</template>

<style scoped lang="scss">
	$occupyHeight: calc(100vh - 80px);
	.self-participant{
		@apply m-2;
		@apply flex justify-center items-center;
		@apply bg-blue-gray-400 bg-opacity-20;
		position:relative;

		max-height: $occupyHeight;
		height: 100%;
		min-height:300px;

		.profile-user{
			position: absolute;
			max-width:100px;
			max-height:100px;
		}

		.track-container {
			width: 100%;
			height: 100%;
			min-height: $occupyHeight;
			position: absolute;
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
import { inject } from "vue"

import type { PageContext } from "$/types/renderer"
import ProfilePicture from "@/consultation/list/profile_picture_item.vue"

type AdditionalPageProps = "consultation"|"chatMessageActivities"
const pageContext = inject("pageContext") as PageContext<"deserialized", AdditionalPageProps>
const { pageProps } = pageContext
const { userProfile } = pageProps

type DefinedProps = {
	containerId: string
	mustShowVideo: boolean
	mustTransmitAudio: boolean
}
defineProps<DefinedProps>()

const selfParticipantId = `${userProfile.data.id}_${userProfile.data.name}`
</script>
