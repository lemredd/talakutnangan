<!--
	General tasks for other members:
	TODO: Refactor all WindiCSS inline classes using @apply directive
	TODO: Refactor HTML to Vue Components if applicable
	TODO: Make use of mixins if applicable
-->
<template>
	<div class="consultations-container ">
		<section class="consultations-picker left">
			<div class="consultations-list-header p-3">
				<h2 class="flex-1">Consultations</h2>
				<button class="material-icons expand-or-collapse">chevron_left</button> <!-- TODO: apply functionality -->
				<button class="material-icons search">search</button> <!-- TODO: Apply functionality -->
				<button class="material-icons add">add</button> <!-- TODO: Apply functionality -->
			</div>
			<div class="consultations-list">
				<div class="mx-auto max-w-[max-content] no-consultations" v-if="!consultations.length">
					<img class="mx-auto" :src="SadIcon" />
					<h2>There are no consultations yet...</h2>
				</div>
				<div v-for="consultation in consultations" @click="pickConsultation(consultation.id)" class="consultation p-2 grid grid-rows-2 grid-cols-[repeat(2,minmax(0,max-content))] hover:bg-gray-300 justify-between">
					<!-- TODO: should contain profile picture?  -->
					<h3 class="consultation-title col-span-full font-400">{{ consultation.title }}</h3>
					<small class="last-chat span">
						{{ consultation.chats ? consultation.chats[consultation.chats.length-1] : "Start by saying hello!" }}
						<!-- TODO: must limit length -->
					</small>
					<div class="last-chat-time-sent">
						HH:MM
						<!-- TODO: Replace with real value soon -->
					</div>
				</div>
			</div>
		</section>

		<section class="selected-consultation flex flex-col right">
			<div class="selected-consultation-header border-b p-3 grid grid-rows-2 grid-cols-[repeat(2,minmax(0,max-content))] justify-between">
				<div class="selected-consultation-title">
					{{ selectedConsultation.title }}
				</div>
				<div class="selected-consultation-user-status row-start-2">
					User is online
					<!-- TODO: must base on user active status -->
				</div>
				<div class="controls row-span-full self-center">
					<button class="material-icons">video_camera_back</button> <!-- TODO: Apply functionality -->
					<button class="material-icons">more_horiz</button> <!-- TODO: Apply functionality -->
				</div>
			</div>
			<div class="selected-consultation-chats px-3 py-5 flex-1 overflow-y-scroll">
				<div class="selected-consultation-new">
					<p><strong>This is a new consultation.</strong> here are some additional details</p>
					<ul class="selected-consultation-additional-details bg-gray-300 p-5">
						<li>Ticket: {{ selectedConsultation.ticket }}</li>
						<li>Status: {{ selectedConsultation.status }}</li>
						<li><a href="#">View printable form (PDF)</a></li> <!-- TODO: Apply functionality -->
					</ul>
				</div>

				<div class="chat-entry" v-for="chat in selectedConsultation.chats">
					{{ chat }}
				</div>
				<!-- TODO_others: properly place chat entries -->
			</div>
			<div class="user-controls border-t p-3 flex">
					<div class="left-controls">
						<button class="material-icons">more_horiz</button> <!-- TODO: Apply functionality -->
						<button class="material-icons">photo_camera</button> <!-- TODO: Apply functionality -->
						<button class="material-icons">image</button> <!-- TODO: Apply functionality -->
					</div>
					<div class="message-box flex-1 border">
						<input type="text">
					</div>
					<div class="right-controls">
						<button class="material-icons">sentiment_satisfied</button> <!-- TODO: Apply functionality -->
						<button class="material-icons">send</button> <!-- TODO: Apply functionality -->
					</div>
				</div>
			<!-- TODO_others(mobile): should view once consultation is clicked in picker (by route) -->
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
let input = ref("")

type Consultation = {
	// TODO: type will change soon
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
		id: 0,
		studentId: 0,
		employeeId: 0,
		ticket: 0,
		title: "Sample Consultation",
		chats: [
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
		isGroup: false,
		status: "ongoing"
	}
])
const selectedConsultationId = ref<number>(0)
const selectedConsultation = computed(function() {
	const selected = consultations.value.filter(function(consultation: Consultation) {
		return consultation.id === selectedConsultationId.value
	})

	return selected[0]
})
function pickConsultation(consultationId: number) {
	selectedConsultationId.value = consultationId
}
</script>
