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
				<div v-for="consultation in consultations" class="consultation p-2 grid grid-rows-2 grid-cols-[repeat(2,minmax(0,max-content))] hover:bg-gray-300 justify-between">
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

		<section class="selected-consultation right">
			placeholder
			<!-- TODO(mobile): should view once consultation is clicked in picker (by route) -->
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
		overflow-y: auto;

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

.r {
	margin-right:130px;
}

.img{
	position:relative;
	margin-top: 200px;;
}
</style>

<script setup lang="ts">
import SadIcon from "./sadicon.png"
import { computed, ref } from "vue"
let input = ref("")
import { ref } from "vue";
let input = ref("");
const consult = [
	{

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
		isGroup: false,
		status: "ongoing"
	}
])
}
</script>
