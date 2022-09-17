<template>
	<div
		v-if="isShown"
		class="overlay bg-[rgba(0,0,0,0.3)] z-1 "
		@click.self="emitClose">
		<div class="content bg-dark-200 text-white">
			<header>
				<slot name="header"></slot>
				<button class="close-btn material-icons-outlined" @click="emitClose">
					close
				</button>
			</header>
			<main>
				<slot></slot>
			</main>
			<footer class="overlay-footer">
				<slot name="footer"></slot>
			</footer>
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
		max-width: 900px;
		height: max-content;

		header {
			display: flex;
			justify-content: space-between;
			margin-bottom: .5em;
			border-bottom: 1px solid white;
			padding-bottom: .5em;

		}

		footer {
			display: flex;
			flex-direction: row-reverse;
		}
	}
}
</style>

<script setup lang="ts">
const { isShown } = defineProps<{ isShown: boolean }>()

const emit = defineEmits([ "close" ])

function emitClose() {
	emit("close")
}
</script>
