<template>
	<img src="@assets/logo_bg_transparent.svg" alt="logo"/>
	<div class="teaser consultation">
		<Description>
			<template #header>
				<h1>Consultation</h1>
			</template>
			<template #details>
				<p>
					Have any questions? Get them answered through our consultation system.
				</p>

				<p class="opening-redirector">
					<a href="/consultation">Start consulting.</a>
				</p>
			</template>
		</Description>
		<div class="graphics">
			<Person accessory="chat" variant="talking left"/>
			<Person accessory="chat" variant="talking right"/>
		</div>
	</div>

	<div class="teaser forum">
		<Description class="forum-description">
			<template #header>
				<h1>
					Forum
				</h1>
			</template>
			<template #details>
				<p>
					Interaction for everyone is made easy.
				</p>

				<p class="opening-redirector">
					<a href="/forum">Visit the forum.</a>
				</p>
			</template>
		</Description>
		<div class="graphics graphics-left">
			<Person accessory="campaign" variant="announce"/>
		</div>
	</div>
</template>
<style scoped lang="scss">
.teaser {
	@apply my-8;
	@apply flex flex-col;
	h1, p {
		text-align: center;
	}

	p {
		@apply my-4;

		&.opening-redirector {
			a {
				text-decoration: underline;
			}
		}
	}
}
.graphics {
	@apply flex justify-center;
}

img {
	@apply flex items-center;
	padding: 2em 0 4em;
}

@screen md {
	.teaser {
		@apply flex-row justify-end;

		h1, p{
				text-align: right;
			}
	}
	.forum {
		@apply justify-start;
		.forum-description{
			@apply order-2;

			h1, p{
				text-align: left;
			}
		}
		.graphics{
			@apply mr-16 order-1;
		}
	}

	.graphics {
		@apply flex-row justify-between;

		&.graphics-left {
			@apply justify-start;
		}
	}
}
</style>

<script lang="ts" setup>
import Person from "@/guest_homepage/opening/Person.vue"
import Description from "@/guest_homepage/opening/Description.vue"
</script>
