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
				<button class="material-icons add">
					add
				</button>
			</div>
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

		<section class="selected-consultation flex flex-col right">
			<!-- TODO(others/mobile): should view once consultation is clicked in picker (by route) -->

			<div class="selected-consultation-header">
				<div class="selected-consultation-title">
					{{ selectedConsultation.title }}
				</div>
				<div class="selected-consultation-user-status row-start-2">
					<!-- TODO(lead): must base on user active status -->
					User is online
				</div>
				<div class="controls row-span-full self-center">
					<!-- TODO(lead/button): Apply functionality -->
					<button class="material-icons">
						video_camera_back
					</button>

					<!-- TODO(lead/button): Apply functionality -->
					<button class="material-icons">
						more_horiz
					</button>
				</div>
			</div>
			<div class="selected-consultation-chats px-3 py-5 flex-1 overflow-y-scroll">
				<div class="selected-consultation-new">
					<p><strong>This is a new consultation.</strong> here are some additional details</p>
					<ul class="selected-consultation-additional-details bg-gray-300 p-5">
						<li>Ticket: {{ selectedConsultation.ticket }}</li>
						<li>Status: {{ selectedConsultation.status }}</li>

						<!-- TODO(lead/button): Apply functionality -->
						<li><a href="#">View printable form (PDF)</a></li>
					</ul>
				</div>

				<div
					v-for="chat in selectedConsultation.chats"
					:key="chat"
					class="chat-entry">
					<!-- TODO(others): properly place chat entries -->
					{{ chat }}
				</div>
			</div>
			<div class="user-controls border-t p-3 flex">
				<div class="left-controls">
					<!-- TODO(lead/button): Apply functionality -->
					<button class="material-icons">
						more_horiz
					</button>
					<!-- TODO(lead/button): Apply functionality -->
					<button class="material-icons">
						photo_camera
					</button>
					<!-- TODO(lead/button): Apply functionality -->
					<button class="material-icons">
						image
					</button>
				</div>
				<div class="message-box flex-1 border">
					<input type="text"/>
				</div>
				<div class="right-controls">
					<!-- TODO(lead/button): Apply functionality -->
					<button class="material-icons">
						sentiment_satisfied
					</button>
					<!-- TODO(lead/button): Apply functionality -->
					<button class="material-icons">
						send
					</button>
				</div>
			</div>
		</section>
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
import SadIcon from "./sadicon.png"
import { computed, ref } from "vue"

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
