<template>
	<footer>
		<div class="links">
			<div
				v-for="i in 4"
				:key="i"
				class="footer-list">
				<h1>Footer</h1>
				<ul>
					<li v-for="j in 3" :key="j">
						Sub Footer
					</li>
				</ul>
			</div>
		</div>
		<div class="copyright">
			<span class="material-icons footer1">copyright</span>
			<span>2022 Talakutnangan, All rights reserved.</span>
		</div>
	</footer>
</template>

<style scoped lang="scss">
footer {
	@apply flex flex-col justify-around;
	background-color: rgb(50,50,50);
	color: white;
	padding: 1em 3em;

	.links {
		@apply flex justify-around;
	}
}

.copyright{
	@apply flex items-center justify-center;
	margin-top: 1em;
	color: white;
}
.footer-list {
	padding: 5px;
}

</style>

<script lang="ts" setup>

</script>
