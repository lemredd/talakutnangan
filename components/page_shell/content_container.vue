<template>
	<div class="content">
		<div class="wrapper">
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

	.wrapper {
		margin: 0 auto;
		max-width: 900px;
	}

	&.login-content {
		.wrapper {
			max-width: initial;
		}
	}
}
</style>
