<template>
	<div
		v-if="isShown"
		class="overlay bg-[rgba(0,0,0,0.3)] z-1 "
		@click.self="emitClose">
		<div class="content dark:bg-dark-200 bg-white text-black text-white">
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
	width: 100%;

	.content {
		@apply flex flex-col justify-between;
		position: absolute;
		inset: 0;
		padding: 1em;
		max-width: 900px;

		height: 100vh;

		@screen sm{
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			overflow: initial;
			height: max-content;
		}

		header {
			@apply flex items-center;
			justify-content: space-between;
			padding: 1em .5em;
			border-bottom: 1px solid white;
		}

		main{
			margin-bottom: 1em;
			padding: 15px;
			max-height: 300px;
			overflow-y: scroll;
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
