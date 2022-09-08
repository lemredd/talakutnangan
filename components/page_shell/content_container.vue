<template>
	<div class="content">
		<div class="container">
			<slot></slot>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@styles/variables.scss";
@import "@styles/mixins.scss";

.content {
	@include useContentBaseHeight;
	margin-top: $navHeight;
	padding: 20px;

	.container {
		max-width: none;
	}
}
</style>
