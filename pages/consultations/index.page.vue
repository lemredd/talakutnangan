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
				</div>
			</div>
		</section>

		<section class="selected-consultation right">
			<p>Sample</p>
			<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
			<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
			<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
			<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
			<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
			<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
			<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
			<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
			<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
			<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
			<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
			<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
			<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
			<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
			<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
			<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
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
@import "@styles/mixins.scss";

.consultations-container {
	section {
		@include useContentBaseHeight;
		overflow-y: auto;

		&.left {
			flex: 1;
			width: min-content;
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
import { ref } from "vue";
let input = ref("");
const consult = [
	{

	}
];
function data() {
	return consult;
}
import SadIcon from "./sadicon.png"
</script>
