<template>
	<img src="@assets/logo_bg_transparent.svg" alt="logo"/>
	<div class="teaser">
		<Description>
			<template #header>
				Consultation
			</template>
			<template #details>
				Students can consult any available employees with the help of Consultation Message.
			</template>
		</Description>
		<div class="graphics">
			<Person accessory="chat" variant="talking left"/>
			<Person accessory="chat" variant="talking right"/>
		</div>
	</div>

	<div class="teaser">
		<Description>
			<template #header>
				Forum
			</template>
			<template #details>
				Students will know the updates of the employees
				and students also can comment on the post of the employees.
			</template>
		</Description>
		<div class="graphics graphics-left">
			<Person accessory="campaign" variant="announce"/>
		</div>
	</div>
</template>
<style scoped lang="scss">
.teaser {
	text-align: center;
}
.graphics {
	@apply flex justify-center;
	margin-top:4em;
}

img {
	@apply flex items-center;
	padding: 2em 0 4em;
}

@media screen and (min-width: 768px) {
	.graphics {
		@apply justify-end;

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
