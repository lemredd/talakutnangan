<!--
	General tasks for other members:
	TODO(others): Refactor all WindiCSS inline classes using @apply directive
	TODO(others): Refactor HTML to Vue Components if applicable
	TODO(others): Make use of mixins if applicable
-->
<template>
	<ConsultationShell @picked-consultation="pickConsultation">
		<template #chat-window>
			<ChatWindow :consultation="selectedConsultation"/>
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
import { computed, inject, ref } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type {
	ConsultationRelationshipNames,
	DeserializedConsultationListDocument
} from "$/types/documents/consultation"

import ChatWindow from "@/consultation/chat_window.vue"
import ConsultationShell from "@/consultation/page_shell.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized", "consultations">
const { pageProps } = pageContext
const userProfile = pageProps.userProfile as DeserializedUserProfile

const consultations = ref<DeserializedConsultationListDocument<ConsultationRelationshipNames>>(
	pageProps.consultations as DeserializedConsultationListDocument<ConsultationRelationshipNames>
)

const selectedConsultationID = ref<string>("1")
const selectedConsultation = computed(() => {
	const foundConsultation = consultations.value.data.find(
		consultation => consultation.id === selectedConsultationID.value
	)

	return foundConsultation
})

function pickConsultation(consultationID: string) {
	selectedConsultationID.value = consultationID
}
</script>
