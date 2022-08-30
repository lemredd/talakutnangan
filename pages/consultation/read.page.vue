<!--
	General tasks for other members:
	TODO(others): Refactor all WindiCSS inline classes using @apply directive
	TODO(others): Refactor HTML to Vue Components if applicable
	TODO(others): Make use of mixins if applicable
-->
<template>
	<ConsultationShell @picked-consultation="pickConsultation">
		<template #chat-window>
			<ChatWindow :consultation="consultation"/>
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
footer {
	display: none !important;
}
</style>

<script setup lang="ts">
import { inject, ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type {
	ConsultationRelationshipNames,
	DeserializedConsultationResource
} from "$/types/documents/consultation"

import ChatWindow from "@/consultation/chat_window.vue"
import ConsultationShell from "@/consultation/page_shell.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized", "consultation">
const { pageProps } = pageContext

const consultation = ref<DeserializedConsultationResource<ConsultationRelationshipNames>>(
	pageProps.consultation.data as DeserializedConsultationResource<ConsultationRelationshipNames>
)

function pickConsultation(unusedConsultationID: string) {
	// TODO: Go to other location
}
</script>
