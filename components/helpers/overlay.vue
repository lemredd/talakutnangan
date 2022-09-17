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
			@apply flex;
			justify-content: space-between;
			margin-bottom: .5em;
			border-bottom: 1px solid white;
			padding-bottom: .5em;

		}

		main{
			padding: 15px;
			max-height: 300px;
			overflow: scroll;
		}

		footer {
			@apply flex justify-between;
			padding:0 .5em .5em;
			border-bottom: 1px solid white;
			padding-bottom: .5em;

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
