<template>
	<div class="progress-container">
		<div class="progress-bar">
			<div class="progress-bar-value"></div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@styles/variables.scss";

.progress-container {
	width: 100%;
}

.progress-bar {
	@apply flex items-center  h-4px;
	background-color: rgba(5, 114, 206, 0.2);
	width: 100%;
	overflow: hidden;
}

.progress-bar-value {
	width: 100%;
	height: 100%;
	background-color: $color-primary;
	animation: indeterminateAnimation 1s infinite linear;
	transform-origin: 0% 50%;
}

@keyframes indeterminateAnimation {
  0% {
    transform:  translateX(0) scaleX(0);
  }
  40% {
    transform:  translateX(0) scaleX(0.4);
  }
  100% {
    transform:  translateX(100%) scaleX(0.5);
  }
}
</style>

<script setup lang="ts">
</script>

