<template>
	<footer class="flex flex-col justify-around bg-dark-200">
		<div class="links flex justify-around">
			<div v-for="N in 4" class ="footer-list">
				<h1>Footer</h1>
				<ul>
					<li v-for = "N in 3">Sub Footer</li>
				</ul>
			</div>
		</div>
		<div class="copyright flex items-center justify-center">
			<span class="material-icons footer1">copyright</span>
			<span>2022 Talakutnangan, All rights reserved.</span>
		</div>
	</footer>
</template>
<style scoped lang="scss">
footer {
	color: #fff;
	padding: 1em 3em;
}

.copyright{
	margin-top: 1em;
	color: #fff;
}
.footer-list {
	padding: 5px;
}

</style>

<script lang="ts" setup>

</script>
