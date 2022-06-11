<template>
	<div class="overlay">
		<div class="content bg-white text-black">
			<header>Header</header>
			<main>
				123
				456
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

	background-color: rgba(0,0,0,0.3);

	.content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 1em;
		width: max-content;
		height: max-content;
	}
}
</style>

<script setup lang="ts">
</script>
