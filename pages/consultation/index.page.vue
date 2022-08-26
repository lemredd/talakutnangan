<!--
	General tasks for other members:
	TODO(others): Refactor all WindiCSS inline classes using @apply directive
	TODO(others): Refactor HTML to Vue Components if applicable
	TODO(others): Make use of mixins if applicable
-->
<template>
	<div class="consultations-container ">
		<section class="consultations-picker left">
			<div class="consultations-list-header p-3">
				<h2 class="flex-1">
					Consultations
				</h2>
				<!-- TODO(lead/button): apply functionality -->
				<button class="material-icons expand-or-collapse">
					chevron_left
				</button>

				<!-- TODO(lead/button): Apply functionality -->
				<button class="material-icons search">
					search
				</button>
				<button
					v-if="isUserAStudent"
					class="material-icons add"
					@click="toggleAddingSchedule">
					add
				</button>
			</div>

			<ConsultationForm :is-shown="isAddingSchedule" @close="toggleAddingSchedule"/>

			<div class="consultations-list">
				<div v-if="!consultations.length" class="mx-auto max-w-[max-content] no-consultations">
					<img class="mx-auto" :src="SadIcon"/>
					<h2>There are no consultations yet...</h2>
				</div>
				<div
					v-for="consultation in consultations.data"
					:key="consultation.id"
					class="consultation"
					@click="pickConsultation(consultation.id)">
					<h3 class="consultation-title col-span-full font-400">
						{{ consultation.title }}
					</h3>

					<small class="last-chat span">
						<!-- TODO(others): must limit length -->
						{{
							consultation.chats
								? consultation.chats[consultation.chats.length - 1]
								: "Start by saying hello!"
						}}
					</small>

					<div class="last-chat-time-sent">
						<!-- TODO(lead): Replace with real value soon -->
						HH:MM
					</div>
				</div>
			</div>
		</section>

		<!-- TODO(minor): conditionally render the contents chat window -->
		<ChatWindow v-if="selectedConsultation" :consultation="selectedConsultation"/>
	</div>
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

<style scoped lang="scss">
@import "@styles/variables.scss";
@import "@styles/mixins.scss";

.consultations-container, .consultations-list-header {
	@apply flex;
}

.consultation {
	@apply
		p-2
		grid grid-rows-2 grid-cols-[repeat(2,minmax(0,max-content))]
		justify-between
		hover:bg-gray-300
}

.selected-consultation-header {
	@apply
		border-b
		p-3
		grid grid-rows-2 grid-cols-[repeat(2,minmax(0,max-content))]
		justify-between
}

.consultations-container {
	section {
		@include useContentBaseHeight;

		&.left {
			min-width: 100%;
			border-right: 1px solid hsla(0,0%,0%,0.1);
			.material-icons {
				&.expand-or-collapse {
					display: none;
				}
			}
		}
		&.right {
			flex: 1;
			display: none;
		}
	}
}

@media screen and (min-width: $mobileViewport) {
	.expand-or-collapse {
		display: inline !important;
	}
	.left {
		min-width: 40% !important;
	}
	.right {
		display: flex !important;
	}
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

import SadIcon from "./sadicon.png"
import ConsultationForm from "@/consultation/form.vue"
import ChatWindow from "@/consultation/chat_window.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized", "consultations">
const { pageProps } = pageContext
const userProfile = pageProps.userProfile as DeserializedUserProfile

const isUserAStudent = computed(() => userProfile.data.kind === "student")

const isAddingSchedule = ref<boolean>(false)
function toggleAddingSchedule() {
	isAddingSchedule.value = !isAddingSchedule.value
}

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
