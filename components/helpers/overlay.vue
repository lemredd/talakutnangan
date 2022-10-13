<template>
	<div
		v-if="isShown"
		class="overlay "
		@click.self="emitClose">
		<div class="content bg-white text-black dark:bg-dark-200 dark:text-white">
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
	@apply z-1 bg-black bg-opacity-30;
	position:fixed;
	inset: 0;
	width: 100%;

	.content {
		@apply flex flex-col;
		position: absolute;
		inset: 0;
		padding: 1em;
		max-width: 900px;

		height: 100vh;

		@screen sm{
			margin: auto 0;
			max-height: 50vh;
			left: 50%;
			transform: translateX(-50%);
		}

		header {
			@apply flex items-center;
			justify-content: space-between;
			padding: 1em .5em;
			border-bottom: 1px solid white;
		}

		main{
			@apply flex-1;
			margin-bottom: 1em;
			padding: 15px;
			overflow-y: auto;
		}

		footer {
			@apply flex justify-between;
			padding:0 .5em .5em;
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
