<template>
	<div class="overlay bg-[rgba(0,0,0,0.3)]" @click.self="emitClose">
		<div class="content bg-dark-200 text-white">
			<header>
				<slot name="header"></slot>
				<button class="close-btn material-icons-outlined" @click="emitClose">close</button>

			</header>
			<main>
				<slot></slot>
			</main>
		</div>
	</div>
</template>

<style scoped lang="scss">
.overlay {
	position:fixed;
	inset: 0;
	height: 100vh;
	width: 100%;

	.content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 1em;
		width: 60%;
		max-width: 900px;
		height: max-content;

		header {
			display: flex;
			justify-content: space-between;
			margin-bottom: .5em;
			border-bottom: 1px solid white;
			padding-bottom: .5em;

		}
	}
}
</style>

<script setup lang="ts">
const emit = defineEmits(["close"])

function emitClose() {
	emit("close")
}
</script>
