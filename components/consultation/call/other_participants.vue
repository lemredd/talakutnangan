<template>
	<div class="other-participants">
		<div
			v-for="participant in otherParticipants"
			:id="participant.remoteID"
			:key="participant.remoteID"
			class="track-container">
		</div>
	</div>
</template>

<style scoped lang="scss">
	.other-participants{
		@apply m-2;
		@apply flex justify-center items-center;
		@apply bg-blue-gray-400 bg-opacity-20;
		position:relative;

		max-height:600px;
		height: 100%;
		min-height:300px;

		.track-container {
			width: 100%;
			height: 100%;
			max-height:600px;
			min-height:300px;
			position: absolute;
		}
	}
</style>

<script setup lang="ts">
import { inject } from "vue"

import type{ RemoteTracks } from "@/consultation/call/helpers/types/video_conference_manager"

import type { PageContext } from "$/types/renderer"

type AdditionalPageProps = "consultation"|"chatMessageActivities"
const pageContext = inject("pageContext") as PageContext<"deserialized", AdditionalPageProps>
const { pageProps } = pageContext
const { chatMessageActivities } = pageProps

type DefinedProps = {
	otherParticipants: RemoteTracks[]
}
defineProps<DefinedProps>()
</script>
