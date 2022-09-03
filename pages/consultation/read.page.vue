<!--
	General tasks for other members:
	TODO(others): Refactor all WindiCSS inline classes using @apply directive
	TODO(others): Refactor HTML to Vue Components if applicable
	TODO(others): Make use of mixins if applicable
-->
<template>
	<ConsultationShell>
		<template #list>
			<ConsultationList :consultations="consultations" @picked-consultation="visitConsultation"/>
		</template>
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
	DeserializedConsultationResource,
	DeserializedConsultationListDocument
} from "$/types/documents/consultation"

import assignPath from "$@/external/assign_path"
import specializePath from "$/helpers/specialize_path"

import ConsultationList from "@/consultation/list.vue"
import ChatWindow from "@/consultation/chat_window.vue"
import ConsultationShell from "@/consultation/page_shell.vue"

type RequiredExtraProps = "consultation"|"consultations"
const pageContext = inject("pageContext") as PageContext<"deserialized", RequiredExtraProps>
const { pageProps } = pageContext

const consultation = ref<DeserializedConsultationResource<ConsultationRelationshipNames>>(
	pageProps.consultation.data as DeserializedConsultationResource<ConsultationRelationshipNames>
)

const consultations = ref<DeserializedConsultationListDocument<ConsultationRelationshipNames>>(
	pageProps.consultations as DeserializedConsultationListDocument<ConsultationRelationshipNames>
)

function visitConsultation(consultationID: string) {
	const path = specializePath("/consultation/:id", {
		"id": consultationID
	})
	assignPath(path)
}
</script>
