<template>
	<div class="other-participants">
		<div
			v-for="participant in otherParticipants"
			:key="participant.remoteID"
			class="track-container">
			<div
				:id="participant.remoteID"
				class="participant-container">
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.other-participants {
		@apply m-2;
		@apply flex flex-col justify-start items-center justify-items-stretch;
		position: relative;

		@screen sm {
			@apply my-2;
			min-height: calc(100vh - 75px);
			max-height: 600px;

			overflow-y: scroll;
			min-width: 40vw;
		}

		height: 100%;
		min-height: 300px;

		.track-container {
			@apply flex-1 m-1;
			@apply bg-blue-gray-400 bg-opacity-20;

			width: 100%;
			height: 100%;

			.participant-container {
				width: 100%;
				height: 100%;
				max-height: 600px;
				min-height: 300px;
			}
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
