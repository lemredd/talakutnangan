<template>
<img src="@assets/logo_bg_transparent.svg" alt="logo" />
<div class="teaser">
	<Description>
		<template #header>Chat header</template>
		<template #details>The quick brown fox jumped over the lazy dog.</template>
	</Description>
	<div class="graphics">
		<Person accessory="chat" variant="talking left"/>
		<Person accessory="chat" variant="talking right"/>
	</div>
</div>

<div class="teaser">
	<Description>
		<template #header>Forum Header</template>
		<template #details>
			Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim, alias?
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
	display: flex;
	justify-content: center;

	margin-top:4em;
}

img {
	padding: 2em 0 4em;
	display: flex;
	align-items: center;
}

@media screen and (min-width: 768px) {
	.graphics {
		justify-content: flex-end;

		&.graphics-left {
			justify-content: flex-start;
		}
	}
}
</style>

<script lang="ts" setup>
import Person from "@/guest_homepage/opening/Person.vue"
import Description from "@/guest_homepage/opening/Description.vue"
</script>
