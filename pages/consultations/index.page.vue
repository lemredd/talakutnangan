<template>
	<div class="consultations-container flex">
		<section class="left">
			<div class="">
				<div class="p-3 md:justify-end md:flex" >
						<p class="r">Consultations</p>
						<button class="material-icons flex">arrow_back_ios</button>
						<button class="material-icons flex">search</button>
						<button class="material-icons flex">add</button>
				</div>
				<img class="img" :src="SadIcon" />
				<p>Click add button to create a consultation</p>
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
			</div>
		</section>

		<section class="right">
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
