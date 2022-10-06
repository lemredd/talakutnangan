<!--
	General tasks for other members:
	TODO(others): Refactor all WindiCSS inline classes using @apply directive
	TODO(others): Refactor HTML to Vue Components if applicable
	TODO(others): Make use of mixins if applicable
-->
<template>
	<ConsultationShell @picked-consultation="pickConsultation">
		<template #list>
			<EmptyConsultationList/>
		</template>
		<template #chat-window>
			<EmptyChatWindow :user-profile="userProfile"/>
		</template>
	</ConsultationShell>
</template>

<style lang="scss">
.content {
	padding: 0 !important;

	.container {
		max-width: none;
		margin: 0 !important;
	}
}

footer:not(.overlay-footer) {
	display: none !important;
}
</style>

<script setup lang="ts">
import { inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedUserProfile } from "$/types/documents/user"

import Fetcher from "$@/fetchers/consultation"

import ConsultationShell from "@/consultation/page_shell.vue"
import EmptyConsultationList from "@/consultation/empty_list.vue"
import EmptyChatWindow from "@/consultation/empty_chat_window.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized", "consultations">
const { pageProps } = pageContext
const userProfile = pageProps.userProfile as DeserializedUserProfile

function pickConsultation(unusedConsultationID: string) {
	// TODO: Go to chat window
}
</script>
