<template>
	<footer>
		<div class="links">
			<ul>
				<h1>GET IN TOUCH</h1>
				<li>
					<small>info@mcc.edu.ph</small>
				</li>
				<li>
					<small>+63-4-5049-8720</small>
				</li>
				<li>
					<small>+63-928-503-9622</small>
				</li>
			</ul>
			<ul>
				<h1>WEBSITE & SOCIAL MEDIA</h1>
				<li>
					<small>
						<a href="https://mcc.edu.ph/">Mabalacat City College</a>
					</small>
				</li>
				<li>
					<small>
						<a href="https://www.facebook.com/TheOfficial.MCC">Facebook</a>
					</small>
				</li>
				<li>
					<small>
						<a
							href="https://www.youtube.com
							/channel/UCH5oJ-rBoD3LTGHYmYsfX7w?view_as=subscriber">YouTube
						</a>
					</small>
				</li>
			</ul>
			<ul>
				<h1>LOCATE US:</h1>
				<li>
					<span class="material-icons">
						location_pin
					</span>
					Rizal St., Barangay Doroles, Mabalacat City, Pampanga
				</li>
				<li>
					<span class="material-icons">
						location_pin
					</span>
					Mawaque Rd, Barangay Dapdap, Mabalacat City, Pampanga
				</li>
			</ul>
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

	@screen sm{
		@apply flex flex-col items-center;
		max-width:100%;
	.links {
		@apply flex flex-row justify-around;
		}
	}
		h1, small, li{
			@apply text-sm text-center;
		}
		ul{
			@apply py-8 px-2;
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
