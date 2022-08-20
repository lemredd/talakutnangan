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

				<!-- TODO(lead/button): Apply functionality -->
				<button class="material-icons add" @click="toggleAddingSchedule">
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
					v-for="consultation in consultations"
					:key="consultation.id"
					class="consultation"
					@click="pickConsultation(consultation.id)">
					<!-- TODO(others): should contain profile picture?  -->

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
		<ChatWindow :consultation="selectedConsultation"/>
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
import { computed, ref } from "vue"
import SadIcon from "./sadicon.png"
import ConsultationForm from "@/consultation/form.vue"
import ChatWindow from "@/consultation/chat_window.vue"

type Consultation = {
	// TODO(lead/types): type will change soon
	id: number
	studentId: number
	employeeId: number
	ticket: number
	title: string
	chats?: string[]
	isGroup: boolean
	members?: number[]
	status: string
}

const isAddingSchedule = ref<boolean>(false)
function toggleAddingSchedule() {
	isAddingSchedule.value = !isAddingSchedule.value
}

const consultations = ref<Consultation[]>([
	{
		"id": 0,
		"studentId": 0,
		"employeeId": 0,
		"ticket": 0,
		"title": "Sample Consultation",
		"chats": [
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat"
		],
		"isGroup": false,
		"status": "ongoing"
	},
	{
		"id": 1,
		"studentId": 0,
		"employeeId": 0,
		"ticket": 0,
		"title": "Sample Consultation2",
		"chats": [
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat",
			"sample chat"
		],
		"isGroup": false,
		"status": "ongoing"
	}
])
const selectedConsultationId = ref<number>(0)
const selectedConsultation = computed(() => {
	const selected = consultations.value.filter(
		(consultation: Consultation) => consultation.id === selectedConsultationId.value
	)

	return selected[0]
})
function pickConsultation(consultationId: number) {
	selectedConsultationId.value = consultationId
}
</script>
